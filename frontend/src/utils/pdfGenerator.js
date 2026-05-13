import html2pdf from 'html2pdf.js';

export const generateGatepassPDF = async (request) => {
 // if (request.status !== 'approved') {
  //alert('Only approved gatepass can generate PDF.');
  //return;
//}

  const nowStr = new Date().toLocaleString();
  const pdfHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Gatepass_${request._id}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: white; }
        .full-page { width: 100%; min-height: 100vh; background: white; display: flex; align-items: center; justify-content: center; padding: 30px; }
        .pdf-card { max-width: 1000px; width: 100%; margin: 20px auto; background: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-radius: 24px; overflow: hidden; }
        .header-bar { background: #1a4a3b; color: white; padding: 35px 40px; text-align: center; }
        .header-bar h1 { margin: 0; font-size: 32px; letter-spacing: 1px; }
        .content { padding: 40px 45px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
        .section { margin-bottom: 35px; }
        .section h3 { color: #2c7a5e; margin-bottom: 15px; font-size: 20px; border-left: 4px solid #2c7a5e; padding-left: 15px; }
        table.detail-table { width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 20px; overflow: hidden; }
        table.detail-table td { padding: 12px 18px; border-bottom: 1px solid #e4e7eb; }
        .signatures { margin-top: 45px; display: flex; justify-content: space-between; border-top: 1px dashed #ccc; padding-top: 30px; }
        .footer { text-align: center; font-size: 11px; color: #6c757d; padding: 20px; background: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="full-page">
        <div class="pdf-card">
          <div class="header-bar">
            <h1>🏭 GATEPASS</h1>
            <p>Official Stock Movement Document</p>
          </div>
          <div class="content">
            <div class="info-row">
              <div><strong>Gatepass ID:</strong> GP-${request._id?.slice(-6)}-${request.direction?.toUpperCase()}</div>
              <div><strong>Issue Date:</strong> ${nowStr}</div>
            </div>
            <div class="section">
              <h3>Applicant Details</h3>
              <table class="detail-table">
                <tr><td style="width:30%"><strong>Name</strong></td><td>${escapeHtml(request.applicant)}</td></tr>
                <tr><td><strong>Phone</strong></td><td>${escapeHtml(request.phone)}</td></tr>
                <tr><td><strong>Email</strong></td><td>${escapeHtml(request.email)}</td></tr>
              </table>
            </div>
            <div class="section">
              <h3>Movement Information</h3>
              <table class="detail-table">
                <tr><td><strong>Direction</strong></td><td>${request.direction === 'inward' ? '📥 INWARD (Receiving)' : '📤 OUTWARD (Issuing)'}</td></tr>
                <tr><td><strong>Gate No.</strong></td><td>${escapeHtml(request.gate)}</td></tr>
                <tr><td><strong>Date/Time</strong></td><td>${new Date(request.datetime).toLocaleString()}</td></tr>
              </table>
            </div>
            <div class="section">
              <h3>Material Details</h3>
              <table class="detail-table">
                <tr><td><strong>Product</strong></td><td>${escapeHtml(request.productName)}</td></tr>
                <tr><td><strong>Quantity</strong></td><td>${request.quantity} ${request.unit || 'units'}</td></tr>
                <tr><td><strong>Purpose</strong></td><td>${escapeHtml(request.purpose || 'Not specified')}</td></tr>
              </table>
            </div>
            <div class="signatures">
              <div>Authorized Sign: _________________</div>
              <div>System Issued Gatepass</div>
            </div>
          </div>
          <div class="footer">This is a system-generated document. Stock updated automatically on approval.</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const element = document.createElement('div');
  element.innerHTML = pdfHtml;
  document.body.appendChild(element);
  
  try {
    await html2pdf().set({
      margin: 0.2,
      filename: `Gatepass_Full_${request._id}.pdf`,
      pagebreak: { mode: 'avoid-all' },
      image: { type: 'jpeg', quality: 0.98 }
    }).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}