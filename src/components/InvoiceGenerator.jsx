import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Save, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import InvoicePDFTemplate from './InvoicePDFTemplate';

export default function InvoiceGenerator() {
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Section 1: Metadata
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  // Section 2: Client Details
  const [clientName, setClientName] = useState('');
  const [clientGSTIN, setClientGSTIN] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // Section 3: Line Items
  const [lineItems, setLineItems] = useState([
    { id: Date.now(), description: '', quantity: 1, rate: 0 }
  ]);

  // Tax Selection
  const [gstType, setGstType] = useState('0'); // '0', '18_igst', '18_cgst_sgst'

  // Calculations
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Auto-generate invoice number on mount
  useEffect(() => {
    let lastNumber = 0;
    const storedLastInvoice = localStorage.getItem('lastInvoiceNumber');
    if (storedLastInvoice) {
      const match = storedLastInvoice.match(/BOS[A-Z]+(\d+)\//);
      if (match && match[1]) {
        lastNumber = parseInt(match[1], 10);
      }
    }
    
    const nextNumber = (lastNumber + 1).toString().padStart(2, '0');
    
    const date = new Date();
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const currentMonth = monthNames[date.getMonth()];
    
    // Calculate Financial Year
    let currentYear = date.getFullYear();
    let nextYear = currentYear + 1;
    if (date.getMonth() < 3) { // Jan, Feb, Mar belong to previous FY
      currentYear -= 1;
      nextYear -= 1;
    }
    const fy = `${currentYear}-${nextYear}`;
    
    setInvoiceNumber(`BOS${currentMonth}${nextNumber}/${fy}`);
  }, []);

  // Update line item description when Virtual Office is selected
  useEffect(() => {
    if (serviceCategory === 'Virtual Office') {
      const prefix = 'SN/ SAC Code: 998599 - ';
      setLineItems(prevItems => prevItems.map(item => {
        if (!item.description.startsWith(prefix)) {
          return { ...item, description: prefix + item.description.replace(/^SN\/ SAC Code: 998599 - /, '') };
        }
        return item;
      }));
    }
  }, [serviceCategory]);

  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.rate)), 0);
    setSubtotal(newSubtotal);

    // Calculate tax
    let newTax = 0;
    if (gstType === '18_igst' || gstType === '18_cgst_sgst') {
      newTax = newSubtotal * 0.18;
    }
    setTaxAmount(newTax);

    // Calculate grand total
    setGrandTotal(newSubtotal + newTax);
  }, [lineItems, gstType]);

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), description: serviceCategory === 'Virtual Office' ? 'SN/ SAC Code: 998599 - ' : '', quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const handleLineItemChange = (id, field, value) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveToDatabase = async () => {
    const errors = {};
    if (!invoiceNumber) errors.invoiceNumber = true;
    if (!clientName) errors.clientName = true;
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!navigator.onLine) {
      toast.error('⚠️ Internet connection required to generate invoices.');
      return;
    }
    
    setLoading(true);
    try {
      let igst = 0, cgst = 0, sgst = 0;
      if (gstType === '18_igst') {
        igst = taxAmount;
      } else if (gstType === '18_cgst_sgst') {
        cgst = taxAmount / 2;
        sgst = taxAmount / 2;
      }

      const sheetPayload = {
        invoiceNumber: invoiceNumber,
        invoiceDate: issueDate,
        dueDate: dueDate,
        clientName: clientName,
        clientGstin: clientGSTIN || 'URP',
        placeOfSupply: billingAddress || '',
        taxableAmount: subtotal,
        igst: igst,
        cgst: cgst,
        sgst: sgst,
        totalAmount: grandTotal,
        paymentStatus: 'Pending'
      };

      const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxrpoi0cgBfRAq-9sM_Mqpjp8U9oi_8tFuBjuVivIiYpdF-LHDop7HEcA2o-lDeG3qr/exec";
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Added no-cors to prevent CORS issues
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(sheetPayload)
      });

      // With no-cors, the response is opaque, so response.ok is false and status is 0.
      // We assume success if fetch didn't throw a network error.
      console.log("Invoice tracked in Google Sheet!");
      toast.success('✅ Invoice saved to Master Ledger!');
      
      // Auto-download PDF immediately after the success alert is dismissed
      await handleDownloadPDF();
      
      // Auto-increment the invoice number for the next one
      localStorage.setItem('lastInvoiceNumber', invoiceNumber);
      const match = invoiceNumber.match(/(BOS[A-Z]+)(\d+)(\/.*)/);
      if (match) {
        const nextNum = (parseInt(match[2], 10) + 1).toString().padStart(2, '0');
        setInvoiceNumber(`${match[1]}${nextNum}${match[3]}`);
      }
      
      // Reset form
      setClientName('');
      setClientGSTIN('');
      setContactPerson('');
      setEmail('');
      setBillingAddress('');
      setLineItems([{ id: Date.now(), description: serviceCategory === 'Virtual Office' ? 'SN/ SAC Code: 998599 - ' : '', quantity: 1, rate: 0 }]);
      setServiceCategory('');
      setSubtotal(0);
      setTaxAmount(0);
      setGrandTotal(0);
      setGstType('0');
      
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error('❌ Failed to save invoice.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!invoiceNumber) {
      setValidationErrors({ invoiceNumber: true });
      toast.error('Invoice Number is required to export.');
      return;
    }

    // Header: Invoice Number, Date, Client Name, GSTIN, Subtotal, Tax, Grand Total
    const headers = [
      'Invoice Number', 'Date', 'Client Name', 'GSTIN', 'Subtotal', 'Tax', 'Grand Total'
    ];

    let csvContent = headers.join(',') + '\n';

    // The user requested: "Write a function that maps the form state into a standard CSV string: Invoice Number, Date, Client Name, GSTIN, Subtotal, Tax, Grand Total"
    // So this is just a single row summary for the invoice
    const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;

    const row = [
      escape(invoiceNumber),
      escape(issueDate),
      escape(clientName),
      escape(clientGSTIN),
      subtotal.toFixed(2),
      taxAmount.toFixed(2),
      grandTotal.toFixed(2)
    ];

    csvContent += row.join(',') + '\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Invoice_${invoiceNumber}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceNumber) {
      setValidationErrors({ invoiceNumber: true });
      toast.error('Invoice Number is required to generate PDF.');
      return;
    }
    
    setLoading(true);
    try {
      const element = document.getElementById('pdf-template');
      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
      
      // Auto-increment the invoice number for the next one if it was just downloaded
      localStorage.setItem('lastInvoiceNumber', invoiceNumber);
      const match = invoiceNumber.match(/(BOS[A-Z]+)(\d+)(\/.*)/);
      if (match) {
        const nextNum = (parseInt(match[2], 10) + 1).toString().padStart(2, '0');
        setInvoiceNumber(`${match[1]}${nextNum}${match[3]}`);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF. ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-8 font-sans pb-24 relative overflow-hidden">
      {/* Hidden PDF Template for html-to-image */}
      <div className="absolute opacity-0 pointer-events-none" style={{ left: '-9999px', top: 0, zIndex: -50 }}>
        <InvoicePDFTemplate data={{
          invoiceNumber, issueDate, dueDate, serviceCategory,
          clientName, clientGSTIN, contactPerson, email, billingAddress,
          lineItems, subtotal, taxAmount, grandTotal, gstType
        }} />
      </div>
      <div className="mb-7">
        <h1 className="text-[24px] font-[800] text-[#111110]">Create Invoice</h1>
        <p className="text-[14px] text-[rgba(17,17,16,0.5)] mt-1">Generate and log new invoices for clients</p>
      </div>

      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] shadow-sm overflow-hidden mb-8">
        {/* Section 1: Metadata */}
        <div className="p-6 border-b border-[rgba(17,17,16,0.08)]">
          <h2 className="text-[15px] font-[700] text-[#111110] mb-5 tracking-wide">1. METADATA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Invoice Number *</label>
              <input required type="text" value={invoiceNumber} onChange={e => { setInvoiceNumber(e.target.value); setValidationErrors(prev => ({...prev, invoiceNumber: false})) }} placeholder="INV-2026-001" className={`h-[44px] bg-[#F9F8F5] border ${validationErrors.invoiceNumber ? 'border-red-500' : 'border-[rgba(17,17,16,0.1)]'} rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all`} />
              {validationErrors.invoiceNumber && <span className="text-[11px] text-red-500">This field is required</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Issue Date</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Service Category</label>
              <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all">
                <option value="">Select Category</option>
                <option value="Virtual Office">Virtual Office</option>
                <option value="Gazette Publication">Gazette Publication</option>
                <option value="GST Registration">GST Registration</option>
                <option value="Company Incorporation">Company Incorporation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Client Details */}
        <div className="p-6 border-b border-[rgba(17,17,16,0.08)] bg-[#FAFAFA]">
          <h2 className="text-[15px] font-[700] text-[#111110] mb-5 tracking-wide">2. CLIENT DETAILS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Client Business Name *</label>
              <input required type="text" value={clientName} onChange={e => { setClientName(e.target.value); setValidationErrors(prev => ({...prev, clientName: false})) }} placeholder="Business Name" className={`h-[44px] bg-white border ${validationErrors.clientName ? 'border-red-500' : 'border-[rgba(17,17,16,0.1)]'} rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all`} />
              {validationErrors.clientName && <span className="text-[11px] text-red-500">This field is required</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Client PAN/GSTIN</label>
              <input type="text" value={clientGSTIN} onChange={e => setClientGSTIN(e.target.value)} placeholder="GSTIN / PAN" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Contact Person</label>
              <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Name" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[600] text-[#111110]">Billing Address</label>
            <textarea rows={3} value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="Full Address" className="p-3 bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] text-[14px] outline-none focus:border-[#111110] transition-all resize-none"></textarea>
          </div>
        </div>

        {/* Section 3: Line Items */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[15px] font-[700] text-[#111110] tracking-wide">3. LINE ITEMS</h2>
            <button onClick={addLineItem} className="px-4 h-[38px] border border-[rgba(17,17,16,0.2)] text-[#111110] bg-[#F9F8F5] rounded-[8px] text-[13px] font-[600] flex items-center gap-2 hover:bg-[rgba(17,17,16,0.05)] transition-colors">
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="w-full overflow-x-auto rounded-[10px] border border-[rgba(17,17,16,0.08)] mb-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#FAFAFA]">
                <tr className="border-b border-[rgba(17,17,16,0.08)]">
                  <th className="py-3 px-4 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[50%]">Item Description</th>
                  <th className="py-3 px-4 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%]">Quantity</th>
                  <th className="py-3 px-4 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%]">Unit Rate (₹)</th>
                  <th className="py-3 px-4 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%] text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="border-b border-[rgba(17,17,16,0.05)] last:border-0 bg-white">
                    <td className="p-3">
                      <input type="text" value={item.description} onChange={e => handleLineItemChange(item.id, 'description', e.target.value)} placeholder="Description" className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[#111110]" />
                    </td>
                    <td className="p-3">
                      <input type="number" min="1" value={item.quantity} onChange={e => handleLineItemChange(item.id, 'quantity', e.target.value)} className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[#111110]" />
                    </td>
                    <td className="p-3">
                      <input type="number" min="0" value={item.rate} onChange={e => handleLineItemChange(item.id, 'rate', e.target.value)} className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[#111110]" />
                    </td>
                    <td className="p-3 text-right text-[14px] font-[600] text-[#111110]">
                      {formatCurrency(item.quantity * item.rate)}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => removeLineItem(item.id)} className="text-[rgba(17,17,16,0.3)] hover:text-[#DC2626] transition-colors p-2" disabled={lineItems.length === 1}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col gap-1.5 max-w-[300px]">
                <label className="text-[13px] font-[600] text-[#111110]">Tax Rate (GST)</label>
                <select value={gstType} onChange={e => setGstType(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[#111110] transition-all">
                  <option value="0">0% GST</option>
                  <option value="18_cgst_sgst">18% (9% CGST + 9% SGST)</option>
                  <option value="18_igst">18% IGST</option>
                </select>
              </div>
            </div>

            <div className="w-full lg:w-[350px] bg-[#FAFAFA] p-5 rounded-[12px] border border-[rgba(17,17,16,0.08)]">
              <div className="flex justify-between w-full text-[14px] mb-3">
                <span className="font-[500] text-[rgba(17,17,16,0.6)]">Subtotal:</span>
                <span className="font-[600] text-[#111110]">{formatCurrency(subtotal)}</span>
              </div>
              
              {gstType !== '0' && (
                <div className="flex justify-between w-full text-[14px] mb-3">
                  <span className="font-[500] text-[rgba(17,17,16,0.6)]">Tax (18%):</span>
                  <span className="font-[600] text-[#111110]">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              
              <div className="w-full h-[1px] bg-[rgba(17,17,16,0.1)] my-4"></div>
              
              <div className="flex justify-between w-full text-[18px]">
                <span className="font-[700] text-[#111110]">Grand Total:</span>
                <span className="font-[800] text-[#1B6B2F]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-end">
        <button onClick={handleDownloadPDF} disabled={loading} className="h-[52px] px-6 rounded-[12px] bg-white border border-[rgba(17,17,16,0.2)] text-[#111110] font-[600] text-[15px] flex items-center justify-center gap-2 hover:bg-[#F9F8F5] transition-all shadow-sm disabled:opacity-70">
          <FileText size={18} />
          {loading ? 'Generating...' : 'Download PDF'}
        </button>
        <button onClick={handleExportCSV} className="h-[52px] px-6 rounded-[12px] bg-white border border-[rgba(17,17,16,0.2)] text-[#111110] font-[600] text-[15px] flex items-center justify-center gap-2 hover:bg-[#F9F8F5] transition-all shadow-sm">
          <Download size={18} />
          Download CSV
        </button>
        <button onClick={handleSaveToDatabase} disabled={loading} className="h-[52px] px-8 rounded-[12px] bg-[#1B6B2F] text-white font-[600] text-[15px] flex items-center justify-center gap-2 hover:bg-[#145324] transition-all shadow-md disabled:opacity-70">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save to Database'}
        </button>
      </div>
    </div>
  );
}
