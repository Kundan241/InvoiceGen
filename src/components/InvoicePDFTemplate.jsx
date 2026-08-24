import React from 'react';

export default function InvoicePDFTemplate({ data }) {
  const {
    invoiceNumber, issueDate, dueDate, serviceCategory,
    clientName, clientGSTIN, contactPerson, email, billingAddress,
    lineItems, subtotal, taxAmount, grandTotal, gstType, isProforma
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

  // Ensure minimum 2 rows in the table to save space
  const displayItems = [...lineItems];
  while (displayItems.length < 2) {
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
    // A4 Width at 96 DPI is 794px. Min height is 1123px (A4 Height).
    <div id="pdf-template" className="bg-[#FFFFFF] font-sans text-[#111110] w-[794px] min-h-[1123px] relative flex flex-col box-border px-12 pt-8 pb-0">
      
      <div className="flex-1 relative z-10 flex flex-col">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-[55%]">
            <img src="/logo.png" alt="BOS Logo" className="h-[65px] object-contain mb-4" />
            <h2 className="text-[17px] font-[700] text-[#1B6B2F] mb-2 uppercase">BHARAT OFFICE SETU PRIVATE LIMITED</h2>
            <div className="flex flex-col gap-0.5 text-[12px] text-[#111110] font-[500] leading-[1.4]">
              <div>B-1 F/F, Opp-savitri Cinema, Greater Kailash,<br/>South Delhi, New Delhi, Delhi, India, 110048</div>
              <div className="mt-1">+91 9019000513</div>
              <div>Partners@bharatofficesetu.com</div>
              <div>www.bharatofficesetu.com</div>
              <div className="mt-1">CIN: U68200DL2025PTC456641</div>
              <div>PAN: AAOCB0254A &nbsp;|&nbsp; GSTIN: 06AAOCB0254A1Z7</div>
            </div>
          </div>

          <div className="w-[45%] pl-4 flex flex-col pt-4">
            <h1 className="text-[44px] font-[800] text-[#1B6B2F] tracking-wide leading-none mb-2">{isProforma ? 'PROFORMA INVOICE' : 'INVOICE'}</h1>
            <div className="text-[14px] font-[500] text-[rgba(17,17,16,0.7)] mb-6"># {invoiceNumber || 'BOSJULY12/2026-2027'}</div>
            
            <div className="w-full text-[12px]">
              <div className="flex py-3 border-t border-[rgba(17,17,16,0.15)]">
                <span className="w-[140px] text-[#1B6B2F] font-[700]">INVOICE DATE</span>
                <span className="text-[#111110] flex-1 text-right">{issueDate || '27 July 2026'}</span>
              </div>
              <div className="flex py-3 border-t border-[rgba(17,17,16,0.15)]">
                <span className="w-[140px] text-[#1B6B2F] font-[700]">DUE DATE</span>
                <span className="text-[#111110] flex-1 text-right">{dueDate || '28 July 2026'}</span>
              </div>
              <div className="flex py-3 border-t border-b border-[rgba(17,17,16,0.15)]">
                <span className="w-[140px] text-[#1B6B2F] font-[700]">PAYMENT TERMS</span>
                <span className="text-[#111110] flex-1 text-right">Net 15 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="flex gap-6 mb-4 mt-2">
          <div className="flex-1 border border-[rgba(17,17,16,0.1)] rounded-[8px] p-4 flex flex-col">
            <div className="text-[13px] font-[700] text-[#1B6B2F] mb-2 uppercase tracking-wide">BILL TO</div>
            <div className="w-full h-[2px] bg-[#1B6B2F] mb-3"></div>
            <div className="font-[700] text-[13px] text-[#111110] mb-1">{clientName || 'DREAM BEAUTY FASHION'}</div>
            {billingAddress ? (
              <div className="text-[12px] text-[#111110] leading-relaxed whitespace-pre-wrap flex-1 min-h-[40px]">{billingAddress}</div>
            ) : <DashedLines />}
            <div className="w-full h-[1px] bg-[rgba(17,17,16,0.1)] my-2"></div>
            <div className="flex text-[12px]">
              <span className="font-[500] text-[rgba(17,17,16,0.6)] w-[80px]">GST No. :</span>
              <span className="font-[600] text-[#111110]">{clientGSTIN || 'AWVPK5125B'}</span>
            </div>
          </div>

          <div className="flex-1 border border-[rgba(17,17,16,0.1)] rounded-[8px] p-4 flex flex-col">
            <div className="text-[13px] font-[700] text-[#1B6B2F] mb-2 uppercase tracking-wide">SHIP TO</div>
            <div className="w-full h-[2px] bg-[#1B6B2F] mb-3"></div>
            <div className="font-[700] text-[13px] text-[#111110] mb-1">{clientName || 'DREAM BEAUTY FASHION'}</div>
            {billingAddress ? (
              <div className="text-[12px] text-[#111110] leading-relaxed whitespace-pre-wrap flex-1 min-h-[40px]">{billingAddress}</div>
            ) : <DashedLines />}
            <div className="w-full h-[1px] bg-[rgba(17,17,16,0.1)] my-2"></div>
            <div className="flex text-[12px]">
              <span className="font-[500] text-[rgba(17,17,16,0.6)] w-[80px]">GST No. :</span>
              <span className="font-[600] text-[#111110]">{clientGSTIN || 'AWVPK5125B'}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[rgba(17,17,16,0.1)] rounded-[8px] overflow-hidden mb-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#1B6B2F] text-[#FFFFFF] text-[11px] font-[700] tracking-wide">
                <th className="py-3 px-3 w-[8%] border-r border-[#FFFFFF]/20">SR. NO.</th>
                <th className="py-3 px-4 text-left border-r border-[#FFFFFF]/20">DESCRIPTION</th>
                <th className="py-3 px-3 w-[12%] border-r border-[#FFFFFF]/20">QTY</th>
                <th className="py-3 px-3 w-[20%] border-r border-[#FFFFFF]/20">UNIT PRICE (₹)</th>
                <th className="py-3 px-3 w-[20%]">AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, i) => (
                <tr key={i} className="border-t border-[rgba(17,17,16,0.1)] h-[35px] text-[12px]">
                  <td className="border-r border-[rgba(17,17,16,0.1)] text-[#111110] font-[500]">{i + 1}</td>
                  <td className="border-r border-[rgba(17,17,16,0.1)] px-4 text-left leading-snug py-2">
                    {!item.isEmpty ? (
                      <div>
                        <div className="font-[600] text-[#111110]">{item.description}</div>
                        {serviceCategory && <div className="text-[11px] text-[rgba(17,17,16,0.7)] font-[400] mt-0.5">(Plan Type - {serviceCategory})</div>}
                      </div>
                    ) : null}
                  </td>
                  <td className="border-r border-[rgba(17,17,16,0.1)] font-[500] text-[#111110]">{!item.isEmpty ? item.quantity : ''}</td>
                  <td className="border-r border-[rgba(17,17,16,0.1)] font-[500] text-[#111110]">{!item.isEmpty ? formatCurrency(item.rate).replace('₹', '') : ''}</td>
                  <td className="font-[500] text-[#111110]">{!item.isEmpty ? formatCurrency(item.quantity * item.rate).replace('₹', '') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-[50%] flex flex-col justify-start">
            <div className="bg-[#F6F6F6] rounded-[8px] p-4 h-[100px]">
              <div className="text-[12px] font-[700] text-[#1B6B2F] mb-2 uppercase tracking-wide">AMOUNT IN WORDS</div>
              <div className="text-[12px] text-[#111110] font-[500]">
                Rupees {numberToWords(Math.round(grandTotal))} Only.
              </div>
            </div>
          </div>

          <div className="w-[50%] border border-[rgba(17,17,16,0.1)] rounded-[8px] overflow-hidden text-[12px]">
            <div className="flex border-b border-[rgba(17,17,16,0.1)] h-[36px] items-center">
              <div className="w-1/2 px-4 font-[700] text-[#111110] border-r border-[rgba(17,17,16,0.1)] h-full flex items-center">SUBTOTAL</div>
              <div className="w-1/2 px-4 text-right font-[500] text-[#111110] h-full flex items-center justify-end">{formatCurrency(subtotal)}</div>
            </div>
            
            <div className="flex border-b border-[rgba(17,17,16,0.1)] h-[36px] items-center">
              <div className="w-1/2 px-4 font-[700] text-[#111110] border-r border-[rgba(17,17,16,0.1)] h-full flex items-center">CGST @9%</div>
              <div className="w-1/2 px-4 text-right font-[500] text-[#111110] h-full flex items-center justify-end">{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2) : '₹0.00'}</div>
            </div>
            
            <div className="flex border-b border-[rgba(17,17,16,0.1)] h-[32px] items-center">
              <div className="w-1/2 px-4 font-[700] text-[#111110] border-r border-[rgba(17,17,16,0.1)] h-full flex items-center">SGST @9%</div>
              <div className="w-1/2 px-4 text-right font-[500] text-[#111110] h-full flex items-center justify-end">{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2) : '₹0.00'}</div>
            </div>

            <div className="flex border-b border-[rgba(17,17,16,0.1)] h-[36px] items-center">
              <div className="w-1/2 px-4 font-[700] text-[#111110] border-r border-[rgba(17,17,16,0.1)] h-full flex items-center">IGST @18%</div>
              <div className="w-1/2 px-4 text-right font-[500] text-[#111110] h-full flex items-center justify-end">{gstType === '18_igst' ? formatCurrency(taxAmount) : '₹0.00'}</div>
            </div>

            <div className="flex bg-[#E6F0E9] text-[#1B6B2F] h-[40px] items-center">
              <div className="w-1/2 px-4 font-[700] text-[13px] h-full flex items-center">TOTAL AMOUNT</div>
              <div className="w-1/2 px-4 text-right font-[700] text-[15px] h-full flex items-center justify-end">{formatCurrency(grandTotal)}</div>
            </div>
          </div>
        </div>

        {/* Remittance & Terms */}
        <div className="flex gap-6 text-[11px] mb-4">
          <div className="w-[50%]">
            <div className="text-[12px] font-[700] text-[#1B6B2F] mb-1 uppercase tracking-wide">BANK DETAILS</div>
            <div className="w-full h-[2px] bg-[#1B6B2F] mb-2"></div>
            <table className="w-full text-[#111110]">
              <tbody>
                <tr className="leading-[1.8]"><td className="w-[110px] font-[500]">Account Name</td><td className="w-[10px]">:</td><td className="font-[600]">BHARAT OFFICE SETU PRIVATE LIMITED</td></tr>
                <tr className="leading-[1.8]"><td className="font-[500]">Account Number</td><td>:</td><td className="font-[600]">44561314863</td></tr>
                <tr className="leading-[1.8]"><td className="font-[500]">IFSC Code</td><td>:</td><td className="font-[600]">SBIN0008441</td></tr>
                <tr className="leading-[1.8]"><td className="font-[500]">Bank Name</td><td>:</td><td className="font-[600]">STATE BANK OF INDIA (SBI)</td></tr>
                <tr className="leading-[1.8]"><td className="font-[500]">Branch</td><td>:</td><td className="font-[600]">GREATER KAILASH- II</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="w-[50%]">
            <div className="text-[12px] font-[700] text-[#1B6B2F] mb-1 uppercase tracking-wide">TERMS & CONDITIONS</div>
            <div className="w-full h-[2px] bg-[#1B6B2F] mb-3"></div>
            <div className="text-[#111110] leading-relaxed font-[400]">
              1. This invoice is computer-generated and does not require a signature.<br/><br/>
              2. The amount paid is non-refundable under any circumstances.
            </div>
          </div>
        </div>

        {/* Thank You & Graphic */}
        <div className="flex justify-center items-center gap-4 mt-auto mb-8 relative z-20 w-full px-12">
          <div className="h-[1px] bg-[#1B6B2F] flex-1"></div>
          <div className="text-[14px] font-[500] italic text-[#111110]">
            Thank you for your business!
          </div>
          <div className="h-[1px] bg-[#1B6B2F] flex-1"></div>
        </div>

      </div>

      {/* Bottom Edge Graphic */}
      <div className="flex w-full h-[10px] absolute bottom-0 left-0">
        <div className="w-[85%] bg-[#1B6B2F]"></div>
        <div className="w-[15%] bg-[#F4831F]"></div>
      </div>
      
    </div>
  );
}
