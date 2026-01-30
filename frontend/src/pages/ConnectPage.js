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
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Invalid connection code or session expired');
      } else {
        setError('Failed to connect to session');
      }
      console.error(err);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setSession(null);
    navigate('/');
  };

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
              
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <Smartphone className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-xl font-semibold mb-2">Remote Screen Preview</p>
                  <p className="text-gray-400">
                    In a full implementation, you would see the host's screen here
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    This demo shows the connection interface. WebRTC peer-to-peer streaming would display the actual screen.
                  </p>
                </div>
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
            <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">💡 Demo Mode</h3>
              <p className="text-gray-300">
                This is a working connection interface. In production, WebRTC would enable real-time screen streaming and remote control capabilities.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
