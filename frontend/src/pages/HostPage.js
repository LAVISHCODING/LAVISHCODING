import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Copy, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HostPage = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [session, setSession] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const startSession = async () => {
    if (!hostName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const response = await axios.post(`${API}/sessions`, {
        host_name: hostName
      });
      setSession(response.data);
      setError('');
      await startScreenShare(response.data);
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
    }
  };

  const startScreenShare = async (sessionData) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsSharing(true);

      // Start polling for client connections
      startSignalingPolling(sessionData, stream);

      // Handle stream end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopSharing();
      });
    } catch (err) {
      setError('Screen sharing was denied or not supported');
      console.error(err);
    }
  };

  const startSignalingPolling = (sessionData, stream) => {
    let lastTimestamp = null;
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const params = new URLSearchParams({
          sender: 'host',
          ...(lastTimestamp && { since: lastTimestamp })
        });
        
        const response = await axios.get(`${API}/signaling/${sessionData.id}?${params}`);
        const messages = response.data;

        for (const message of messages) {
          lastTimestamp = message.timestamp;
          await handleSignalingMessage(message, sessionData, stream);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1000);
  };

  const handleSignalingMessage = async (message, sessionData, stream) => {
    if (message.type === 'answer' && message.sender === 'client') {
      // Received answer from client
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.data));
      }
    } else if (message.type === 'ice-candidate' && message.sender === 'client') {
      // Received ICE candidate from client
      if (peerConnectionRef.current && message.data.candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.data));
      }
    } else if (message.type === 'request-offer' && message.sender === 'client') {
      // Client is requesting an offer
      await createAndSendOffer(sessionData, stream);
    }
  };

  const createAndSendOffer = async (sessionData, stream) => {
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

      // Add stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle ICE candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await axios.post(`${API}/signaling`, {
            session_id: sessionData.id,
            sender: 'host',
            type: 'ice-candidate',
            data: event.candidate.toJSON()
          });
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await axios.post(`${API}/signaling`, {
        session_id: sessionData.id,
        sender: 'host',
        type: 'offer',
        data: offer
      });

      console.log('Offer sent to client');
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const stopSharing = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    setIsSharing(false);
    
    if (session) {
      try {
        await axios.post(`${API}/sessions/${session.id}/end`);
        await axios.delete(`${API}/signaling/${session.id}`);
      } catch (err) {
        console.error(err);
      }
    }
    
    navigate('/');
  };

  const copyCode = () => {
    if (session) {
      navigator.clipboard.writeText(session.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
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
            <Monitor className="w-8 h-8 text-blue-400" />
            Host Session
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            data-testid="back-button"
          >
            Back
          </button>
        </div>

        {!session ? (
          /* Setup Form */
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-center">Start Hosting</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    data-testid="host-name-input"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg" data-testid="error-message">
                    {error}
                  </div>
                )}

                <button
                  onClick={startSession}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  data-testid="start-hosting-button"
                >
                  Start Hosting
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-400 text-center">
                You'll receive a 6-digit code to share with others
              </div>
            </div>
          </div>
        ) : (
          /* Active Session */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Connection Code Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-center">
              <h2 className="text-xl font-semibold mb-2">Your Connection Code</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-5xl font-bold tracking-widest" data-testid="connection-code">
                  {session.code}
                </div>
                <button
                  onClick={copyCode}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  data-testid="copy-code-button"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-blue-100">Share this code with the person who wants to connect</p>
            </div>

            {/* Screen Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Your Screen</h3>
                <div className="flex items-center gap-2">
                  {isSharing && (
                    <span className="flex items-center gap-2 text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Sharing
                    </span>
                  )}
                </div>
              </div>
              
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                  data-testid="screen-preview"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={stopSharing}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  data-testid="stop-sharing-button"
                >
                  <X className="w-5 h-5" />
                  Stop Sharing
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Session Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Host:</span> {session.host_name}</p>
                <p><span className="text-gray-400">Status:</span> <span className="text-green-400 capitalize">{session.status}</span></p>
                <p><span className="text-gray-400">Session ID:</span> {session.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostPage;
