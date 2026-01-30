from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random
import string


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    host_name: str
    status: str = "active"  # active, connected, ended
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    connected_at: Optional[datetime] = None
    client_name: Optional[str] = None

class SessionCreate(BaseModel):
    host_name: str

class SessionConnect(BaseModel):
    code: str
    client_name: str

class SignalingMessage(BaseModel):
    session_id: str
    sender: str  # host or client
    type: str  # offer, answer, ice-candidate
    data: dict

class SignalingData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    sender: str
    type: str
    data: dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper function to generate connection code
def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# Routes
@api_router.get("/")
async def root():
    return {"message": "RemoteLink Pro API"}

@api_router.post("/sessions", response_model=Session)
async def create_session(input: SessionCreate):
    # Generate unique code
    code = generate_code()
    
    # Check if code already exists
    existing = await db.sessions.find_one({"code": code, "status": "active"})
    while existing:
        code = generate_code()
        existing = await db.sessions.find_one({"code": code, "status": "active"})
    
    session = Session(code=code, host_name=input.host_name)
    doc = session.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.sessions.insert_one(doc)
    return session

@api_router.post("/sessions/connect")
async def connect_session(input: SessionConnect):
    # Find active session with code
    session_doc = await db.sessions.find_one({"code": input.code, "status": "active"})
    
    if not session_doc:
        raise HTTPException(status_code=404, detail="Session not found or expired")
    
    # Update session
    update_data = {
        "status": "connected",
        "connected_at": datetime.now(timezone.utc).isoformat(),
        "client_name": input.client_name
    }
    
    await db.sessions.update_one(
        {"code": input.code},
        {"$set": update_data}
    )
    
    # Return session info
    session_doc.update(update_data)
    session_doc['created_at'] = datetime.fromisoformat(session_doc['created_at'])
    session_doc['connected_at'] = datetime.fromisoformat(session_doc['connected_at'])
    
    return Session(**session_doc)

@api_router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session_doc = await db.sessions.find_one({"id": session_id})
    
    if not session_doc:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Convert timestamps
    if isinstance(session_doc['created_at'], str):
        session_doc['created_at'] = datetime.fromisoformat(session_doc['created_at'])
    if session_doc.get('connected_at') and isinstance(session_doc['connected_at'], str):
        session_doc['connected_at'] = datetime.fromisoformat(session_doc['connected_at'])
    
    return Session(**session_doc)

@api_router.post("/sessions/{session_id}/end")
async def end_session(session_id: str):
    result = await db.sessions.update_one(
        {"id": session_id},
        {"$set": {"status": "ended"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Session ended"}

@api_router.get("/sessions", response_model=List[Session])
async def get_active_sessions():
    sessions = await db.sessions.find({"status": {"$in": ["active", "connected"]}}, {"_id": 0}).to_list(100)
    
    for session in sessions:
        if isinstance(session['created_at'], str):
            session['created_at'] = datetime.fromisoformat(session['created_at'])
        if session.get('connected_at') and isinstance(session['connected_at'], str):
            session['connected_at'] = datetime.fromisoformat(session['connected_at'])
    
    return sessions

# WebRTC Signaling endpoints
@api_router.post("/signaling")
async def send_signaling(message: SignalingMessage):
    # Store signaling message
    signaling_data = SignalingData(
        session_id=message.session_id,
        sender=message.sender,
        type=message.type,
        data=message.data
    )
    
    doc = signaling_data.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.signaling.insert_one(doc)
    return {"status": "success"}

@api_router.get("/signaling/{session_id}")
async def get_signaling(session_id: str, sender: str, since: Optional[str] = None):
    # Get signaling messages for this session that are NOT from this sender
    query = {
        "session_id": session_id,
        "sender": {"$ne": sender}
    }
    
    if since:
        query["timestamp"] = {"$gt": since}
    
    messages = await db.signaling.find(query, {"_id": 0}).sort("timestamp", 1).to_list(100)
    
    return messages

@api_router.delete("/signaling/{session_id}")
async def clear_signaling(session_id: str):
    # Clear all signaling messages for this session
    await db.signaling.delete_many({"session_id": session_id})
    return {"status": "success"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()