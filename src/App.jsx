import React, { useState } from 'react'
import PWAInstallBanner from './components/PWAInstallBanner'
import InvoiceGenerator from './components/InvoiceGenerator'

import { Toaster } from 'react-hot-toast'

function App() {
  const [activeTab, setActiveTab] = useState('invoice');

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      {/* Top Navigation Bar */}
      <nav className="bg-[#111110] text-white h-16 flex items-center px-6 sticky top-0 z-50">
        <div className="font-bold text-[16px] tracking-wide">
          BOS Internal - Invoice Engine
        </div>
      </nav>

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-[1000px] mb-4 flex gap-2">
          <button 
            onClick={() => setActiveTab('invoice')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === 'invoice' ? 'bg-[#1B6B2F] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Tax Invoice
          </button>
          <button 
            onClick={() => setActiveTab('proforma')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === 'proforma' ? 'bg-[#1B6B2F] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Proforma Invoice
          </button>
        </div>
        <InvoiceGenerator isProforma={activeTab === 'proforma'} key={activeTab} />
      </main>
    </div>
  )
}

export default App
