import React from 'react'
import PWAInstallBanner from './components/PWAInstallBanner'
import InvoiceGenerator from './components/InvoiceGenerator'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-[#111110] text-white h-16 flex items-center px-6 sticky top-0 z-50">
        <div className="font-bold text-[16px] tracking-wide">
          BOS Internal - Invoice Engine
        </div>
      </nav>

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-8 px-4">
        <InvoiceGenerator />
      </main>
    </div>
  )
}

export default App
