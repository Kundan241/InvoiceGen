import React from 'react';
import { 
  MapPin, Phone, Mail, Globe, Navigation, Hash, 
  Calendar, CalendarCheck, FileText, User, Receipt
} from 'lucide-react';

export default function InvoicePDFTemplate({ data }) {
  const {
    invoiceNumber, issueDate, dueDate, serviceCategory,
    clientName, clientGSTIN, contactPerson, email, billingAddress,
    lineItems, subtotal, taxAmount, grandTotal, gstType
  } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str.trim();
  };

  // Ensure minimum 5 rows in the table
  const displayItems = [...lineItems];
  while (displayItems.length < 5) {
    displayItems.push({ id: Math.random(), description: '', quantity: '', rate: '', isEmpty: true });
  }

  const DashedLines = () => (
    <div className="flex flex-col gap-[22px] mt-4 mb-2">
      <div className="border-b border-dashed border-[#9CA3AF] w-full h-[1px]"></div>
      <div className="border-b border-dashed border-[#9CA3AF] w-full h-[1px]"></div>
      <div className="border-b border-dashed border-[#9CA3AF] w-full h-[1px]"></div>
    </div>
  );

  return (
    // A4 Size at 96 DPI is 794x1123
    <div id="pdf-template" className="bg-[#FFFFFF] font-sans text-[#111110] w-[794px] h-[1123px] relative overflow-hidden flex flex-col box-border">
      
      {/* Top Right Graphic - cleanly drawn with SVG to prevent overlaps */}
      <svg className="absolute top-0 right-0 z-0" width="300" height="150" viewBox="0 0 300 150" fill="none">
        <path d="M120 0 H300 V150 C220 150 150 80 120 0 Z" fill="#F4831F" />
        <path d="M140 0 H300 V130 C230 130 160 70 140 0 Z" fill="#FFFFFF" />
        <path d="M150 0 H300 V120 C240 120 170 60 150 0 Z" fill="#1B6B2F" />
      </svg>

      <div className="px-10 pt-10 flex-1 relative z-10 flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          
          <div className="w-[52%] pr-2">
            <img src="/logo.png" alt="BOS Logo" className="h-[75px] object-contain mb-4" />
            <h2 className="text-[16px] font-[800] text-[#1B6B2F] mb-3">Bharat office setu private limited</h2>
            
            <div className="flex flex-col gap-2 text-[11px] text-[rgba(17,17,16,0.8)] font-[500]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5"><MapPin size={12} /></div>
                <div className="leading-[1.4]">B-1 F/F, Opp-savitri Cinema, Greater Kailash,<br/>South Delhi, New Delhi, Delhi, India, 110048</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0"><Phone size={12} /></div>
                <div>+91 9019000513</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0"><Mail size={12} /></div>
                <div>Partners@bharatofficesetu.com</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0"><Globe size={12} /></div>
                <div>www.bharatofficesetu.com</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0"><Hash size={12} /></div>
                <div>CIN: U68200DL2025PTC456641</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0"><Navigation size={12} /></div>
                <div>PAN: AAOCB0254A &nbsp;|&nbsp; GSTIN: 06AAOCB0254A1Z7</div>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] self-stretch bg-[#D1D5DB] mx-4 my-2"></div>

          <div className="w-[45%] pl-6 pt-4 relative z-20">
            <h1 className="text-[46px] font-[800] text-[#1B6B2F] tracking-wider leading-none mb-2 bg-[#FFFFFF] inline-block pr-4">INVOICE</h1>
            <div className="text-[13px] font-[800] text-[#F4831F] mb-6"># {invoiceNumber || 'BOS/DRAFT'}</div>
            
            <div className="flex flex-col gap-4 text-[12px]">
              <div className="flex items-center">
                <Calendar size={16} className="text-[#1B6B2F] mr-3" />
                <span className="font-[800] text-[#1B6B2F] w-[120px]">INVOICE DATE</span>
                <span className="font-[600] text-[#111110]">: {issueDate || '-'}</span>
              </div>
              <div className="flex items-center">
                <CalendarCheck size={16} className="text-[#1B6B2F] mr-3" />
                <span className="font-[800] text-[#1B6B2F] w-[120px]">DUE DATE</span>
                <span className="font-[600] text-[#111110]">: {dueDate || '-'}</span>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="text-[#1B6B2F] mr-3" />
                <span className="font-[800] text-[#1B6B2F] w-[120px]">PAYMENT TERMS</span>
                <span className="font-[600] text-[#111110]">: Net 15 Days</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bill To & Ship To */}
        <div className="flex gap-4 mb-6">
          
          <div className="flex-1 border-[1px] border-[#D1D5DB] rounded-[10px] overflow-hidden flex flex-col">
            <div className="bg-[#1B6B2F] text-[#FFFFFF] px-4 py-2 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#FFFFFF] text-[#1B6B2F] flex items-center justify-center shrink-0">
                <User size={14} fill="currentColor" />
              </div>
              <span className="text-[12px] font-[800] tracking-wider">BILL TO</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between h-[150px]">
              <div>
                <div className="font-[800] text-[13px] text-[#111110] leading-none mb-1">{clientName || 'XXX'}</div>
                {billingAddress ? (
                  <div className="text-[12px] text-[#111110] leading-relaxed whitespace-pre-wrap mt-2">{billingAddress}</div>
                ) : <DashedLines />}
              </div>
              <div className="flex gap-10 text-[12px] mt-4">
                <span className="font-[600] text-[rgba(17,17,16,0.6)]">GST NO.</span>
                <span className="font-[700] text-[#111110]">: {clientGSTIN || 'XXX'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 border-[1px] border-[#D1D5DB] rounded-[10px] overflow-hidden flex flex-col">
            <div className="bg-[#1B6B2F] text-[#FFFFFF] px-4 py-2 flex items-center gap-2 shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#FFFFFF] text-[#1B6B2F] flex items-center justify-center shrink-0">
                <User size={14} fill="currentColor" />
              </div>
              <span className="text-[12px] font-[800] tracking-wider">SHIP TO</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between h-[150px]">
              <div>
                <div className="font-[800] text-[13px] text-[#111110] leading-none mb-1">{clientName || 'XXX'}</div>
                {billingAddress ? (
                  <div className="text-[12px] text-[#111110] leading-relaxed whitespace-pre-wrap mt-2">{billingAddress}</div>
                ) : <DashedLines />}
              </div>
              <div className="flex gap-10 text-[12px] mt-4">
                <span className="font-[600] text-[rgba(17,17,16,0.6)]">GST NO.</span>
                <span className="font-[700] text-[#111110]">: {clientGSTIN || 'XXX'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Table */}
        <div className="border border-[#D1D5DB] rounded-[8px] overflow-hidden mb-6">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#1B6B2F] text-[#FFFFFF] text-[10px] font-[800] tracking-wide">
                <th className="py-3 px-3 w-[8%] border-r border-[#FFFFFF]/20">SR. NO.</th>
                <th className="py-3 px-4 text-left border-r border-[#FFFFFF]/20">DESCRIPTION</th>
                <th className="py-3 px-3 w-[12%] border-r border-[#FFFFFF]/20">QTY</th>
                <th className="py-3 px-3 w-[20%] border-r border-[#FFFFFF]/20">UNIT PRICE (₹)</th>
                <th className="py-3 px-3 w-[20%]">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, i) => (
                <tr key={i} className="border-b border-[#D1D5DB] last:border-b-0 h-[45px] text-[11px]">
                  <td className="border-r border-[#D1D5DB] text-[rgba(17,17,16,0.8)] font-[500]">{i + 1}</td>
                  <td className="border-r border-[#D1D5DB] px-4 text-left leading-snug">
                    {!item.isEmpty ? (
                      <div>
                        <div className="font-[800] text-[#111110]">{item.description}</div>
                        {serviceCategory && <div className="text-[10px] text-[rgba(17,17,16,0.7)] font-[500]">(Plan Type - {serviceCategory})</div>}
                      </div>
                    ) : null}
                  </td>
                  <td className="border-r border-[#D1D5DB] font-[500]">{!item.isEmpty ? item.quantity : ''}</td>
                  <td className="border-r border-[#D1D5DB] font-[500]">{!item.isEmpty ? formatCurrency(item.rate).replace('₹', '') : ''}</td>
                  <td className="font-[600] text-[#111110]">{!item.isEmpty ? formatCurrency(item.quantity * item.rate).replace('₹', '') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Area */}
        <div className="flex gap-4 mb-8">
          <div className="w-[50%]">
            <div className="bg-[#F2F7F4] rounded-[10px] p-4 flex gap-4 h-[120px]">
              <div className="w-10 h-10 rounded-full bg-[#1B6B2F] text-[#FFFFFF] flex items-center justify-center shrink-0">
                <Receipt size={20} />
              </div>
              <div className="pt-1">
                <div className="text-[12px] font-[800] text-[#1B6B2F] mb-1">Amount in Words</div>
                <div className="text-[11px] text-[#111110] font-[600]">
                  Rupees {numberToWords(Math.round(grandTotal))} Only.
                </div>
              </div>
            </div>
          </div>

          <div className="w-[50%] border border-[#D1D5DB] rounded-[10px] overflow-hidden text-[11px]">
            <div className="flex border-b border-[#D1D5DB] h-[24px] items-center">
              <div className="w-1/2 px-4 font-[800] text-[#111110] border-r border-[#D1D5DB] h-full flex items-center">SUBTOTAL</div>
              <div className="w-1/2 px-4 text-right font-[600] text-[#111110] h-full flex items-center justify-end">{formatCurrency(subtotal)}</div>
            </div>
            
            <div className="flex border-b border-[#D1D5DB] h-[24px] items-center">
              <div className="w-1/2 px-4 font-[800] text-[#111110] border-r border-[#D1D5DB] h-full flex items-center">CGST @9%</div>
              <div className="w-1/2 px-4 text-right font-[600] text-[#111110] h-full flex items-center justify-end">{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2) : '₹0.00'}</div>
            </div>
            
            <div className="flex border-b border-[#D1D5DB] h-[24px] items-center">
              <div className="w-1/2 px-4 font-[800] text-[#111110] border-r border-[#D1D5DB] h-full flex items-center">SGST @9%</div>
              <div className="w-1/2 px-4 text-right font-[600] text-[#111110] h-full flex items-center justify-end">{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2) : '₹0.00'}</div>
            </div>

            <div className="flex border-b border-[#D1D5DB] h-[24px] items-center">
              <div className="w-1/2 px-4 font-[800] text-[#111110] border-r border-[#D1D5DB] h-full flex items-center">IGST @18%</div>
              <div className="w-1/2 px-4 text-right font-[600] text-[#111110] h-full flex items-center justify-end">{gstType === '18_igst' ? formatCurrency(taxAmount) : '₹0.00'}</div>
            </div>

            <div className="flex bg-[#1B6B2F] text-[#FFFFFF] h-[24px] items-center">
              <div className="w-1/2 px-4 font-[800] text-[12px] h-full flex items-center">TOTAL AMOUNT</div>
              <div className="w-1/2 px-4 text-right font-[800] text-[13px] h-full flex items-center justify-end">{formatCurrency(grandTotal)}</div>
            </div>
          </div>
        </div>

        {/* Remittance & Terms */}
        <div className="flex gap-4 text-[10px] mb-8">
          <div className="w-[50%]">
            <div className="text-[11px] font-[800] text-[#1B6B2F] mb-3 uppercase">REMITTANCE DETAILS</div>
            <table className="w-full">
              <tbody>
                <tr className="leading-relaxed"><td className="w-[120px] text-[rgba(17,17,16,0.7)] font-[600]">ACCOUNT NAME</td><td className="font-[800] text-[#111110]">: BHARAT OFFICE SETU PRIVATE LIMITED</td></tr>
                <tr className="leading-relaxed"><td className="text-[rgba(17,17,16,0.7)] font-[600]">ACCOUNT NUMBER</td><td className="font-[800] text-[#111110]">: 44561314863</td></tr>
                <tr className="leading-relaxed"><td className="text-[rgba(17,17,16,0.7)] font-[600]">IFSC CODE</td><td className="font-[800] text-[#111110]">: SBIN0008441</td></tr>
                <tr className="leading-relaxed"><td className="text-[rgba(17,17,16,0.7)] font-[600]">BANK NAME</td><td className="font-[800] text-[#111110]">: STATE BANK OF INDIA (SBI)</td></tr>
                <tr className="leading-relaxed"><td className="text-[rgba(17,17,16,0.7)] font-[600]">BRANCH</td><td className="font-[800] text-[#111110]">: GREATER KAILASH- II</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="w-[50%] pl-4">
            <div className="text-[11px] font-[800] text-[#1B6B2F] mb-3 uppercase">TERMS & CONDITIONS</div>
            <div className="text-[rgba(17,17,16,0.8)] leading-relaxed font-[500] pr-4">
              1. This invoice is computer-generated and does not require a signature.<br/><br/>
              2. The amount paid is non-refundable under any circumstances.
            </div>
          </div>
        </div>

        {/* Thank You & Signature */}
        <div className="flex justify-between items-end mt-auto mb-8 relative z-20">
          <div className="text-[16px] font-[800] text-[#1B6B2F]">
            Thank you for your business!
          </div>
          <div className="text-center w-[220px]">
            <div className="h-[40px] flex justify-center items-end mb-1">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 25C15 15 25 10 35 20C45 30 50 15 55 5" stroke="#111110" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 35L20 20" stroke="#111110" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="22" cy="18" r="1.5" fill="#111110"/>
              </svg>
            </div>
            <div className="border-t-[1.5px] border-[#111110] pt-2 text-[10px] font-[800] text-[#1B6B2F] tracking-wider">
              AUTHORIZED SIGNATORY
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer Graphic - strictly constrained bounds */}
      <div className="w-full h-[24px] mt-auto relative z-[20] flex items-center px-10">
        <div className="text-[#FFFFFF] text-[10px] font-[500] flex items-center z-20">
          <Globe size={12} className="mr-2" /> www.bharatofficesetu.com
        </div>
        <div className="absolute top-0 left-0 w-full h-[24px] bg-[#1B6B2F] z-[10]"></div>
      </div>
      
      <svg className="absolute bottom-0 right-0 z-[5]" width="300" height="80" viewBox="0 0 300 80" fill="none">
        <path d="M0 80 C100 80 200 0 300 0 V80 H0 Z" fill="#1B6B2F" />
        <path d="M50 80 C130 80 230 10 300 10 V80 H50 Z" fill="#F4831F" />
        <path d="M70 80 C150 80 250 20 300 20 V80 H70 Z" fill="#1B6B2F" />
      </svg>
    </div>
  );
}
