import { LightThemeFactory, DarkThemeFactory, BlueLightThemeFactory } from './themes/ThemeFactory.js';

class PaymentUI {
  constructor() {
    this.currentTheme = new LightThemeFactory();
    this.initializeLocalStorage();
    this.initializeEventListeners();
    this.loadPaymentHistory();
    this.applyTheme('light');
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
  }

  hidePaymentForm() {
    document.getElementById('paymentFormContainer').style.display = 'none';
    document.getElementById('paymentForm').reset();
    document.getElementById('result').style.display = 'none';
  }

  loadPaymentHistory() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const paymentsList = document.getElementById('paymentsList');
    paymentsList.innerHTML = '';

    payments.forEach(payment => {
      const card = document.createElement('div');
      card.className = 'payment-card';
      card.innerHTML = `
        <h3>Payment #${payment.id}</h3>
        <p>Amount: $${payment.finalAmount}</p>
        <p>Method: ${payment.paymentMethod}</p>
        <p>Date: ${new Date(payment.date).toLocaleString()}</p>
      `;
      paymentsList.appendChild(card);
    });
  }

  async handlePayment(e) {
    e.preventDefault();
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
        
        this.showResult(`Payment processed successfully. Final amount: $${result.finalAmount}`, 'success');
        this.loadPaymentHistory();
        setTimeout(() => this.hidePaymentForm(), 2000);
      } else {
        this.showResult('Error processing payment: ' + result.error, 'error');
      }
    } catch (error) {
      this.showResult('Error processing payment: ' + error.message, 'error');
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

// Initialize the UI
new PaymentUI();