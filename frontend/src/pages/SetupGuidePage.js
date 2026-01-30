import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, ArrowRight, CheckCircle, ExternalLink, Info } from 'lucide-react';

const SetupGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Complete Remote Access Setup</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            data-testid="back-button"
          >
            Back to Home
          </button>
        </div>

        {/* Introduction */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-400" />
            Hybrid Remote Access Solution
          </h2>
          <p className="text-gray-300 text-lg">
            For the best experience, we recommend using <strong>both tools together</strong>:
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* RemoteLink Pro */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">RemoteLink Pro</h3>
            </div>
            
            <p className="text-gray-400 mb-4">Your current web app</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">View remote screen in real-time</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">No installation required</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Works on any browser</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Simple 6-digit code pairing</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg mb-4">
              <p className="text-yellow-200 text-sm">
                <strong>Limitation:</strong> Viewing only - cannot control mouse/keyboard
              </p>
            </div>

            <button
              onClick={() => navigate('/host')}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Start Viewing Session
            </button>
          </div>

          {/* Chrome Remote Desktop */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-500/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Chrome Remote Desktop</h3>
            </div>
            
            <p className="text-gray-400 mb-4">For full control capability</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Full mouse & keyboard control</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">100% free by Google</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Secure & encrypted</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Mobile apps available</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg mb-4">
              <p className="text-blue-200 text-sm">
                <strong>Best for:</strong> Full desktop control from mobile
              </p>
            </div>

            <a
              href="https://remotedesktop.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Setup Chrome Remote Desktop</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Chrome Remote Desktop Setup Guide</h2>
          
          <div className="space-y-8">
            {/* Host Setup */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</div>
                Setup on Host PC
              </h3>
              <div className="ml-10 space-y-3">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Open Chrome browser on the PC you want to control</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Go to <a href="https://remotedesktop.google.com/access" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">remotedesktop.google.com/access</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Click "Set up Remote Access" under "Set up via SSH"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Click "Turn On" and follow the installation prompts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Give your computer a name (e.g., "My PC")</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Create a PIN (at least 6 digits) - remember this!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Setup */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm">2</div>
                Connect from Mobile/Another PC
              </h3>
              <div className="ml-10 space-y-3">
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 mb-2"><strong>Mobile:</strong> Download Chrome Remote Desktop app</p>
                    <div className="flex gap-3">
                      <a href="https://apps.apple.com/app/chrome-remote-desktop/id944025852" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">iOS App Store</a>
                      <a href="https://play.google.com/store/apps/details?id=com.google.chromeremotedesktop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Android Play Store</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300"><strong>Another PC:</strong> Open Chrome and go to <a href="https://remotedesktop.google.com/access" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">remotedesktop.google.com/access</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Sign in with the same Google account used on host PC</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">You'll see your PC listed - click on it</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Enter the PIN you created</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold text-green-400">✅ Done! You now have full control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-green-300">💡 Pro Tips</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Keep Chrome browser running on host PC</li>
              <li>• Use a strong PIN for security</li>
              <li>• Both devices need internet connection</li>
              <li>• Works behind firewalls (uses Google's relay)</li>
              <li>• Connection is end-to-end encrypted</li>
            </ul>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-purple-300">🎯 Best Practices</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Use RemoteLink Pro for quick viewing</li>
              <li>• Use Chrome Remote Desktop for control</li>
              <li>• Sign out when done for security</li>
              <li>• Update Chrome regularly</li>
              <li>• Test connection before you need it</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/host')}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Use RemoteLink Pro (View Only)
            </button>
            <a
              href="https://remotedesktop.google.com/access"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Setup Chrome Remote Desktop</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupGuidePage;
