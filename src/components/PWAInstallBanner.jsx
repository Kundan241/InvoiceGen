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
    <div className="bg-[#1B6B2F] text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
      <div className="text-[14px] font-medium text-center sm:text-left">
        Install the BOS Admin App for native desktop/mobile access
      </div>
      <button 
        onClick={handleInstallClick}
        className="shrink-0 bg-white text-[#1B6B2F] px-4 py-2 rounded-full text-[13px] font-bold hover:bg-[#F9F8F5] transition-colors flex items-center gap-2"
      >
        <Download size={16} />
        Install Now
      </button>
    </div>
  );
}
