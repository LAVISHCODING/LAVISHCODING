import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ConnectPage = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [code, setCode] = useState('');
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const connectToSession = async () => {
    if (!clientName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!code.trim() || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      const response = await axios.post(`${API}/sessions/connect`, {
        code: code.toUpperCase(),
        client_name: clientName
      });
      setSession(response.data);
      setIsConnected(true);
      setError('');
      
      // Request offer from host and start WebRTC connection
      await requestOfferFromHost(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Invalid connection code or session expired');
      } else {
        setError('Failed to connect to session');
      }
      console.error(err);
    }
  };

  const requestOfferFromHost = async (sessionData) => {
    try {
      // Send request for offer
      await axios.post(`${API}/signaling`, {
        session_id: sessionData.id,
        sender: 'client',
        type: 'request-offer',
        data: {}
      });

      // Start polling for host's offer
      startSignalingPolling(sessionData);
    } catch (err) {
      console.error('Error requesting offer:', err);
      setError('Failed to establish connection');
    }
  };

  const startSignalingPolling = (sessionData) => {
    let lastTimestamp = null;
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const params = new URLSearchParams({
          sender: 'client',
          ...(lastTimestamp && { since: lastTimestamp })
        });
        
        const response = await axios.get(`${API}/signaling/${sessionData.id}?${params}`);
        const messages = response.data;

        for (const message of messages) {
          lastTimestamp = message.timestamp;
          await handleSignalingMessage(message, sessionData);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1000);
  };

  const handleSignalingMessage = async (message, sessionData) => {
    if (message.type === 'offer' && message.sender === 'host') {
      // Received offer from host
      await handleOffer(message.data, sessionData);
    } else if (message.type === 'ice-candidate' && message.sender === 'host') {
      // Received ICE candidate from host
      if (peerConnectionRef.current && message.data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.data));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    }
  };

  const handleOffer = async (offer, sessionData) => {
    try {
      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      // Handle incoming stream
      pc.ontrack = (event) => {
        console.log('Received remote stream');
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await axios.post(`${API}/signaling`, {
            session_id: sessionData.id,
            sender: 'client',
            type: 'ice-candidate',
            data: event.candidate.toJSON()
          });
        }
      };

      // Set remote description and create answer
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer to host
      await axios.post(`${API}/signaling`, {
        session_id: sessionData.id,
        sender: 'client',
        type: 'answer',
        data: answer
      });

      console.log('Answer sent to host');
    } catch (err) {
      console.error('Error handling offer:', err);
      setError('Failed to establish video connection');
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const disconnect = async () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (session) {
      try {
        await axios.post(`${API}/sessions/${session.id}/end`);
      } catch (err) {
        console.error(err);
      }
    }
    
    setIsConnected(false);
    setSession(null);
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-purple-400" />
            Connect to Session
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            data-testid="back-button"
          >
            Back
          </button>
        </div>

        {!isConnected ? (
          /* Connection Form */
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-center">Join a Session</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    data-testid="client-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Connection Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-center text-2xl font-bold tracking-widest"
                    maxLength={6}
                    data-testid="connection-code-input"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg" data-testid="error-message">
                    {error}
                  </div>
                )}

                <button
                  onClick={connectToSession}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  data-testid="connect-button"
                >
                  <span>Connect</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-400 text-center">
                Enter the 6-digit code shared by the host
              </div>
            </div>
          </div>
        ) : (
          /* Connected View */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Connection Status */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></span>
                <h2 className="text-xl font-semibold">Connected to {session?.host_name}</h2>
              </div>
              <p className="text-green-100">You're now viewing the remote screen</p>
            </div>

            {/* Remote Screen View */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Remote Screen</h3>
                <span className="text-sm text-gray-400">Code: {session?.code}</span>
              </div>
              
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  data-testid="remote-screen"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={disconnect}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                  data-testid="disconnect-button"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Session Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Host:</span> {session?.host_name}</p>
                <p><span className="text-gray-400">Client:</span> {clientName}</p>
                <p><span className="text-gray-400">Status:</span> <span className="text-green-400 capitalize">{session?.status}</span></p>
                <p><span className="text-gray-400">Session ID:</span> {session?.id}</p>
              </div>
            </div>

            {/* Control Info */}
            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-green-300">✅ Live Connection</h3>
              <p className="text-gray-300">
                You're now viewing the host's screen in real-time via WebRTC peer-to-peer connection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
