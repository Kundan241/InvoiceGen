import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#F4F3EE] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-gray-100">
            <Download size={32} className="text-[#1B6B2F]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Install BOS Admin</h3>
          <p className="text-sm text-gray-600 mb-6">
            Install this application to your device's home screen for quick access, offline support, and a native app experience.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleInstallClick}
              className="w-full bg-[#1B6B2F] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#145324] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download size={18} />
              Install App
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              className="w-full bg-gray-50 text-gray-600 px-4 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
