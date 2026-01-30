import React from 'react';
import { Monitor, Smartphone, Zap, Shield, Radio, MousePointer, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" data-testid="hero-title">
            RemoteLink Pro
          </h1>
          <p className="text-2xl text-gray-300 mb-4" data-testid="hero-subtitle">
            View and Control your PC from anywhere
          </p>
          <p className="text-lg text-gray-400 mb-4">
            Real-time screen streaming with instant response. No installation required.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 mb-8 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>Hybrid Solution:</strong> RemoteLink Pro for viewing + Chrome Remote Desktop for control
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => navigate('/host')}
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 w-64"
              data-testid="host-button"
            >
              <div className="flex items-center justify-center gap-3">
                <Monitor className="w-6 h-6" />
                <span>Host from PC</span>
              </div>
            </button>
            <button
              onClick={() => navigate('/connect')}
              className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 w-64"
              data-testid="connect-button"
            >
              <div className="flex items-center justify-center gap-3">
                <Smartphone className="w-6 h-6" />
                <span>View from Mobile</span>
              </div>
            </button>
          </div>

          {/* Setup Guide Button */}
          <div className="mb-20">
            <button
              onClick={() => navigate('/setup-guide')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center gap-2 mx-auto"
              data-testid="setup-guide-button"
            >
              <BookOpen className="w-5 h-5" />
              <span>Full Control Setup Guide</span>
            </button>
            <p className="text-gray-500 text-sm mt-2">Learn how to add mouse & keyboard control</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all" data-testid="feature-streaming">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Radio className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time streaming</h3>
              <p className="text-gray-400 text-sm">Ultra-low latency screen sharing</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all" data-testid="feature-keyboard">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Full keyboard control</h3>
              <p className="text-gray-400 text-sm">Via Chrome Remote Desktop</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all" data-testid="feature-mouse">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MousePointer className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mouse simulation</h3>
              <p className="text-gray-400 text-sm">Via Chrome Remote Desktop</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all" data-testid="feature-secure">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure connection</h3>
              <p className="text-gray-400 text-sm">End-to-end encrypted sessions</p>
            </div>
          </div>

          {/* Industrial Grade Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Industrial-Grade Remote Access</h2>
            <p className="text-xl text-gray-400">
              Built for performance. Designed for precision. Optimized for speed.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <a
            href="https://app.emergent.sh/?utm_source=emergent-badge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <img
              src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4"
              alt="Emergent"
              className="w-6 h-6 rounded"
            />
            <span>Made with Emergent</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
