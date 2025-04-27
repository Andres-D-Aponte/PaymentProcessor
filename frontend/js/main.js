import { LightThemeFactory, DarkThemeFactory, BlueLightThemeFactory } from './themes/ThemeFactory.js';
import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm';
import { PDFBuilder } from './pdf/PDFBuilder.js';

class PaymentUI {
  constructor() {
    this.currentTheme = new LightThemeFactory();
    this.pdfBuilder = new PDFBuilder();
    this.currentPaymentForPdf = null;
    this.currentPage = 1;
    this.pageSize = 4;
    this.initializeLocalStorage();
    this.initializeEventListeners();
    this.loadPaymentHistory();
    this.applyTheme('light');
  }

  showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  showNotificationStatus(status) {
    const statusDiv = document.getElementById('notificationStatus');
    let html = '<div class="notification-status ';
    html += status.success ? 'success' : 'error';
    html += '">';
    
    if (status.success) {
      html += '<p>✓ Pago procesado exitosamente</p>';
      if (status.notifications.email === 'sent') {
        html += '<p>✓ Notificación enviada por email</p>';
      }
      if (status.notifications.sms === 'sent') {
        html += '<p>✓ Notificación enviada por SMS</p>';
      }
    } else {
      html += `<p>✗ Error: ${status.error}</p>`;
      if (status.notifications.email === 'failed') {
        html += '<p>✗ Error al enviar notificación por email</p>';
      }
      if (status.notifications.sms === 'failed') {
        html += '<p>✗ Error al enviar notificación por SMS</p>';
      }
    }
    
    html += '</div>';
    statusDiv.innerHTML = html;
    statusDiv.style.display = 'block';
  }

  initializeLocalStorage() {
    if (!localStorage.getItem('payments')) {
      const initialPayments = [
        {
          id: 1,
          amount: 150.00,
          paymentMethod: 'CREDIT_CARD',
          email: 'john@example.com',
          phone: '+1234567890',
          date: '2025-01-15T10:30:00',
          finalAmount: 164.50
        },
        {
          id: 2,
          amount: 75.50,
          paymentMethod: 'PAYPAL',
          email: 'jane@example.com',
          phone: '+1987654321',
          date: '2025-01-16T14:45:00',
          finalAmount: 84.01
        }
      ];
      localStorage.setItem('payments', JSON.stringify(initialPayments));
    }
  }

  initializeEventListeners() {
    document.getElementById('themeSelect').addEventListener('change', (e) => this.setTheme(e.target.value));
    document.getElementById('newPayment').addEventListener('click', () => this.showPaymentForm());
    document.getElementById('cancelPayment').addEventListener('click', () => this.hidePaymentForm());
    document.getElementById('paymentForm').addEventListener('submit', (e) => this.handlePayment(e));
    document.getElementById('pdfConfigForm').addEventListener('submit', (e) => this.handlePdfGeneration(e));
    document.getElementById('pageSize').addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.currentPage = 1;
      this.loadPaymentHistory();
    });
  }

  setTheme(theme) {
    switch (theme) {
      case 'dark':
        this.currentTheme = new DarkThemeFactory();
        break;
      case 'blue':
        this.currentTheme = new BlueLightThemeFactory();
        break;
      default:
        this.currentTheme = new LightThemeFactory();
    }
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    const themeStyle = this.currentTheme.createTheme();

    root.style.setProperty('--primary-color', themeStyle.primaryColor);
    root.style.setProperty('--secondary-color', themeStyle.secondaryColor);
    root.style.setProperty('--background-color', themeStyle.backgroundColor);
    root.style.setProperty('--text-color', themeStyle.textColor);
    root.style.setProperty('--border-color', themeStyle.borderColor);
    root.style.setProperty('--panel-background', themeStyle.panelBackground);

    document.getElementById('themeSelect').value = theme;
  }

  showPaymentForm() {
    document.getElementById('paymentFormContainer').style.display = 'block';
    document.getElementById('notificationStatus').style.display = 'none';
  }

  hidePaymentForm() {
    document.getElementById('paymentFormContainer').style.display = 'none';
    document.getElementById('paymentForm').reset();
    document.getElementById('result').style.display = 'none';
    document.getElementById('notificationStatus').style.display = 'none';
  }

  toggleLogoUpload() {
    const logoUpload = document.getElementById('logoUpload');
    const includeLogo = document.getElementById('includeLogo').checked;
    logoUpload.classList.toggle('visible', includeLogo);
  }

  showPdfConfigModal(payment) {
    this.currentPaymentForPdf = payment;
    document.getElementById('pdfConfigModal').style.display = 'block';
    document.getElementById('pdfTheme').value = payment.theme || 'LIGHT';
  }

  closePdfConfigModal() {
    document.getElementById('pdfConfigModal').style.display = 'none';
    this.currentPaymentForPdf = null;
  }

  async handlePdfGeneration(e) {
    e.preventDefault();
    if (!this.currentPaymentForPdf) return;

    let logoDataUrl = null;
    if (document.getElementById('includeLogo').checked) {
      const logoFile = document.getElementById('logoFile').files[0];
      if (logoFile) {
        logoDataUrl = await this.getBase64Image(logoFile);
      }
    }

    const config = {
      includeLogo: document.getElementById('includeLogo').checked,
      logoData: logoDataUrl,
      title: document.getElementById('pdfTitle').value,
      includePaymentDetails: document.getElementById('includePaymentDetails').checked,
      includeUserInfo: document.getElementById('includeUserInfo').checked,
      theme: document.getElementById('pdfTheme').value,
      includeTimestamp: document.getElementById('includeTimestamp').checked,
      footerMessage: document.getElementById('footerMessage').value,
      format: document.getElementById('pdfFormat').value
    };

    this.generatePDF(this.currentPaymentForPdf, config);
    this.closePdfConfigModal();
  }

  async getBase64Image(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  generatePDF(payment, config = {}) {
    const doc = new jsPDF();
    
    this.pdfBuilder
      .setIncludeLogo(config.includeLogo)
      .setLogoData(config.logoData)
      .setTitle(config.title)
      .setIncludePaymentDetails(config.includePaymentDetails)
      .setIncludeUserInfo(config.includeUserInfo)
      .setTheme(config.theme)
      .setIncludeTimestamp(config.includeTimestamp)
      .setFooterMessage(config.footerMessage)
      .setFormat(config.format)
      .build(payment, doc);

    doc.save(`comprobante-pago-${payment.id}.pdf`);
  }

  translatePaymentMethod(method) {
    const translations = {
      'CREDIT_CARD': 'Tarjeta de Crédito',
      'DEBIT_CARD': 'Tarjeta de Débito',
      'PAYPAL': 'PayPal'
    };
    return translations[method] || method;
  }

  loadPaymentHistory() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const totalPages = Math.ceil(payments.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pagedPayments = payments.slice(start, end);

    const tableBody = document.getElementById('paymentsTableBody');
    tableBody.innerHTML = '';

    pagedPayments.forEach(payment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${payment.id}</td>
        <td>$${payment.amount.toFixed(2)}</td>
        <td>$${payment.finalAmount.toFixed(2)}</td>
        <td>${this.translatePaymentMethod(payment.paymentMethod)}</td>
        <td>${new Date(payment.date).toLocaleString()}</td>
        <td>
          <button onclick="window.paymentUI.showPdfConfigModal(${JSON.stringify(payment).replace(/"/g, '&quot;')})" class="primary-button">
            Generar PDF
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    this.updatePagination(totalPages);
  }

  updatePagination(totalPages) {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    if (totalPages > 1) {
      // Previous button
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Anterior';
      prevButton.className = 'secondary-button';
      prevButton.disabled = this.currentPage === 1;
      prevButton.onclick = () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadPaymentHistory();
        }
      };
      paginationButtons.appendChild(prevButton);

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === this.currentPage ? 'primary-button' : 'secondary-button';
        pageButton.onclick = () => {
          this.currentPage = i;
          this.loadPaymentHistory();
        };
        paginationButtons.appendChild(pageButton);
      }

      // Next button
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Siguiente';
      nextButton.className = 'secondary-button';
      nextButton.disabled = this.currentPage === totalPages;
      nextButton.onclick = () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.loadPaymentHistory();
        }
      };
      paginationButtons.appendChild(nextButton);
    }
  }

  async handlePayment(e) {
    e.preventDefault();
    this.showLoading();

    const formData = {
      paymentType: document.getElementById('paymentMethod').value,
      amount: parseFloat(document.getElementById('amount').value),
      notificationDetails: {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
      }
    };

    try {
      const response = await fetch('http://localhost:3000/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const newPayment = {
          id: payments.length + 1,
          amount: formData.amount,
          paymentMethod: formData.paymentType,
          email: formData.notificationDetails.email,
          phone: formData.notificationDetails.phone,
          date: new Date().toISOString(),
          finalAmount: result.finalAmount
        };
        
        payments.push(newPayment);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        this.showNotificationStatus({
          success: true,
          notifications: result.notifications
        });
        
        this.loadPaymentHistory();
        setTimeout(() => this.hidePaymentForm(), 3000);
      } else {
        this.showNotificationStatus({
          success: false,
          error: result.error,
          notifications: result.notifications
        });
      }
    } catch (error) {
      this.showNotificationStatus({
        success: false,
        error: error.message,
        notifications: {
          email: 'failed',
          sms: 'failed'
        }
      });
    } finally {
      this.hideLoading();
    }
  }

  showResult(message, type) {
    const resultPanel = document.getElementById('result');
    resultPanel.textContent = message;
    resultPanel.style.display = 'block';
    resultPanel.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    resultPanel.style.color = type === 'success' ? '#155724' : '#721c24';
  }
}

// Initialize the UI and make it globally accessible for the PDF generation
window.paymentUI = new PaymentUI();