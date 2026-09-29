const fetchLastInvoice = async () => {
    let lastNumber = 0;
    
    try {
      const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxrpoi0cgBfRAq-9sM_Mqpjp8U9oi_8tFuBjuVivIiYpdF-LHDop7HEcA2o-lDeG3qr/exec";
      const response = await fetch(`${WEBHOOK_URL}?action=getLastInvoice`);
      const data = await response.json();
      
      if (data && data.lastInvoiceNumber) {
        const match = data.lastInvoiceNumber.match(/BOS[A-Z]+(\d+)\//);
        if (match && match[1]) {
          lastNumber = parseInt(match[1], 10);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch from sheet", err);
    }

    const nextNumber = (lastNumber + 1).toString().padStart(2, '0');
    
    const date = new Date();
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const currentMonth = monthNames[date.getMonth()];
    
    let currentYear = date.getFullYear();
    let nextYear = currentYear + 1;
    if (date.getMonth() < 3) { 
      currentYear -= 1;
      nextYear -= 1;
    }
    const fy = `${currentYear}-${nextYear}`;
    
    const isProforma = false;
    const prefix = isProforma ? 'PI-BOS' : 'BOS';
    const result = `${prefix}${currentMonth}${nextNumber}/${fy}`;
    console.log("Generated Invoice Number:", result);
  };
fetchLastInvoice();
