import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111110',
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    width: '55%',
  },
  logo: {
    height: 40,
    width: 120, // Adjust depending on aspect ratio
    objectFit: 'contain',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1B6B2F',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 8,
    color: '#111110',
    lineHeight: 1.4,
  },
  invoiceInfo: {
    width: '45%',
    paddingLeft: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B6B2F',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#666',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#1B6B2F',
    fontSize: 8,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 8,
  },
  addressesRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  addressBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
  },
  addressTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1B6B2F',
    marginBottom: 5,
  },
  addressLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#1B6B2F',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clientAddress: {
    fontSize: 8,
    marginBottom: 8,
    lineHeight: 1.4,
    minHeight: 25,
  },
  clientGstRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 5,
  },
  clientGstLabel: {
    fontSize: 8,
    color: '#666',
    width: 50,
  },
  clientGstValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1B6B2F',
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableHeaderCol: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    fontSize: 8,
    minHeight: 25,
    alignItems: 'center',
  },
  tableCol: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  col1: { width: '8%', textAlign: 'center' },
  col2: { width: '40%', textAlign: 'left' },
  col3: { width: '12%', textAlign: 'center' },
  col4: { width: '20%', textAlign: 'center' },
  col5: { width: '20%', textAlign: 'center', borderRightWidth: 0 },
  totalsSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  amountInWords: {
    width: '50%',
    backgroundColor: '#F6F6F6',
    borderRadius: 6,
    padding: 10,
    height: 70,
  },
  totalsBox: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
  },
  totalRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 25,
    alignItems: 'center',
  },
  totalLabel: {
    width: '50%',
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  totalValue: {
    width: '50%',
    paddingHorizontal: 10,
    textAlign: 'right',
    fontSize: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#E6F0E9',
    height: 30,
    alignItems: 'center',
  },
  grandTotalLabel: {
    width: '50%',
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#1B6B2F',
    fontSize: 9,
  },
  grandTotalValue: {
    width: '50%',
    paddingHorizontal: 10,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#1B6B2F',
    fontSize: 10,
  },
  footerSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  footerBox: {
    width: '50%',
  },
  footerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1B6B2F',
    marginBottom: 5,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 8,
  },
  bankLabel: {
    width: 80,
  },
  bankValue: {
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 8,
    lineHeight: 1.4,
  },
  thankYouBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  thankYouLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1B6B2F',
  },
  thankYouText: {
    paddingHorizontal: 15,
    fontSize: 10,
    fontStyle: 'italic',
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    flexDirection: 'row',
  },
  bottomEdgeGreen: {
    width: '85%',
    backgroundColor: '#1B6B2F',
    height: 8,
  },
  bottomEdgeOrange: {
    width: '15%',
    backgroundColor: '#F4831F',
    height: 8,
  }
});

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

  const displayItems = [...lineItems];
  while (displayItems.length < 2) {
    displayItems.push({ id: Math.random(), description: '', quantity: '', rate: '', isEmpty: true });
  }

  const DashedLines = () => (
    <View style={{ flexDirection: 'column', gap: 15, marginVertical: 10 }}>
      <View style={{ borderBottomWidth: 1, borderBottomStyle: 'dashed', borderColor: '#9CA3AF' }} />
      <View style={{ borderBottomWidth: 1, borderBottomStyle: 'dashed', borderColor: '#9CA3AF' }} />
      <View style={{ borderBottomWidth: 1, borderBottomStyle: 'dashed', borderColor: '#9CA3AF' }} />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.companyInfo}>
            <Image src="/logo.png" style={styles.logo} />
            <Text style={styles.companyName}>BHARAT OFFICE SETU PRIVATE LIMITED</Text>
            <View style={styles.companyDetails}>
              <Text>B-1 F/F, Opp-savitri Cinema, Greater Kailash,</Text>
              <Text>South Delhi, New Delhi, Delhi, India, 110048</Text>
              <Text style={{ marginTop: 2 }}>+91 9019000513</Text>
              <Text>Partners@bharatofficesetu.com</Text>
              <Text>www.bharatofficesetu.com</Text>
              <Text style={{ marginTop: 2 }}>CIN: U68200DL2025PTC456641</Text>
              <Text>PAN: AAOCB0254A  |  GSTIN: 06AAOCB0254A1Z7</Text>
            </View>
          </View>
          
          <View style={styles.invoiceInfo}>
            <Text style={styles.title}>{isProforma ? 'PROFORMA INVOICE' : 'INVOICE'}</Text>
            <Text style={styles.invoiceNumber}># {invoiceNumber || 'BOSJULY12/2026-2027'}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>INVOICE DATE</Text>
              <Text style={styles.infoValue}>{issueDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DUE DATE</Text>
              <Text style={styles.infoValue}>{dueDate}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }]}>
              <Text style={styles.infoLabel}>PAYMENT TERMS</Text>
              <Text style={styles.infoValue}>Net 15 Days</Text>
            </View>
          </View>
        </View>

        {/* Bill To & Ship To */}
        <View style={styles.addressesRow}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>BILL TO</Text>
            <View style={styles.addressLine} />
            <Text style={styles.clientName}>{clientName || 'DREAM BEAUTY FASHION'}</Text>
            {billingAddress ? (
              <Text style={styles.clientAddress}>{billingAddress}</Text>
            ) : <DashedLines />}
            <View style={styles.clientGstRow}>
              <Text style={styles.clientGstLabel}>GST No. :</Text>
              <Text style={styles.clientGstValue}>{clientGSTIN || 'AWVPK5125B'}</Text>
            </View>
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>SHIP TO</Text>
            <View style={styles.addressLine} />
            <Text style={styles.clientName}>{clientName || 'DREAM BEAUTY FASHION'}</Text>
            {billingAddress ? (
              <Text style={styles.clientAddress}>{billingAddress}</Text>
            ) : <DashedLines />}
            <View style={styles.clientGstRow}>
              <Text style={styles.clientGstLabel}>GST No. :</Text>
              <Text style={styles.clientGstValue}>{clientGSTIN || 'AWVPK5125B'}</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, styles.col1]}>SR. NO.</Text>
            <Text style={[styles.tableHeaderCol, styles.col2]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderCol, styles.col3]}>QTY</Text>
            <Text style={[styles.tableHeaderCol, styles.col4]}>UNIT PRICE</Text>
            <Text style={[styles.tableHeaderCol, styles.col5]}>AMOUNT</Text>
          </View>
          
          {displayItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.col1]}>{!item.isEmpty ? (i + 1) : ''}</Text>
              <View style={[styles.tableCol, styles.col2, { justifyContent: 'center' }]}>
                {!item.isEmpty && (
                  <>
                    <Text style={{ fontWeight: 'bold' }}>{item.description}</Text>
                    {serviceCategory && <Text style={{ fontSize: 7, color: '#666', marginTop: 2 }}>(Plan Type - {serviceCategory})</Text>}
                  </>
                )}
              </View>
              <Text style={[styles.tableCol, styles.col3]}>{!item.isEmpty ? item.quantity : ''}</Text>
              <Text style={[styles.tableCol, styles.col4]}>{!item.isEmpty ? formatCurrency(item.rate).replace('₹', 'Rs. ') : ''}</Text>
              <Text style={[styles.tableCol, styles.col5]}>{!item.isEmpty ? formatCurrency(item.quantity * item.rate).replace('₹', 'Rs. ') : ''}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.amountInWords}>
            <Text style={styles.addressTitle}>AMOUNT IN WORDS</Text>
            <Text style={{ fontSize: 8 }}>Rupees {numberToWords(Math.round(grandTotal))} Only.</Text>
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal).replace('₹', 'Rs. ')}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>CGST @9%</Text>
              <Text style={styles.totalValue}>{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2).replace('₹', 'Rs. ') : 'Rs. 0.00'}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SGST @9%</Text>
              <Text style={styles.totalValue}>{gstType === '18_cgst_sgst' ? formatCurrency(taxAmount / 2).replace('₹', 'Rs. ') : 'Rs. 0.00'}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGST @18%</Text>
              <Text style={styles.totalValue}>{gstType === '18_igst' ? formatCurrency(taxAmount).replace('₹', 'Rs. ') : 'Rs. 0.00'}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal).replace('₹', 'Rs. ')}</Text>
            </View>
          </View>
        </View>

        {/* Remittance & Terms */}
        <View style={styles.footerSection}>
          <View style={styles.footerBox}>
            <Text style={styles.footerTitle}>BANK DETAILS</Text>
            <View style={styles.addressLine} />
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Name :</Text>
              <Text style={styles.bankValue}>BHARAT OFFICE SETU PRIVATE LIMITED</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Number :</Text>
              <Text style={styles.bankValue}>44561314863</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>IFSC Code :</Text>
              <Text style={styles.bankValue}>SBIN0008441</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Bank Name :</Text>
              <Text style={styles.bankValue}>STATE BANK OF INDIA (SBI)</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Branch :</Text>
              <Text style={styles.bankValue}>GREATER KAILASH- II</Text>
            </View>
          </View>

          <View style={styles.footerBox}>
            <Text style={styles.footerTitle}>TERMS & CONDITIONS</Text>
            <View style={styles.addressLine} />
            <Text style={styles.termsText}>1. This invoice is computer-generated and does not require a signature.</Text>
            <Text style={[styles.termsText, { marginTop: 5 }]}>2. The amount paid is non-refundable under any circumstances.</Text>
          </View>
        </View>

        {/* Thank you */}
        <View style={styles.thankYouBox}>
          <View style={styles.thankYouLine} />
          <Text style={styles.thankYouText}>Thank you for your business!</Text>
          <View style={styles.thankYouLine} />
        </View>

        {/* Bottom edge graphics */}
        <View style={styles.bottomEdge}>
          <View style={styles.bottomEdgeGreen} />
          <View style={styles.bottomEdgeOrange} />
        </View>

      </Page>
    </Document>
  );
}
