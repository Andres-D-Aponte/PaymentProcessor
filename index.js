import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { PaymentProcessor } from './src/processor/PaymentProcessor.js';
import { emailConfig } from './src/config/emailConfig.js';

const app = express();
const port = 3000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const processor = new PaymentProcessor();

const transporter = nodemailer.createTransport(emailConfig);

app.post('/process-payment', async (req, res) => {
  try {
    const { paymentType, amount, notificationDetails } = req.body;
    const finalAmount = processor.processPayment(paymentType, amount, notificationDetails);

    // Send email notification if email is provided
    if (notificationDetails.email) {
      const mailOptions = {
        from: 'your-email@gmail.com', // Replace with your email
        to: notificationDetails.email,
        subject: 'Procesamiento de Pago',
        html: `
          <h2>Detalles del Pago</h2>
          <p><strong>Monto Original:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Monto Final:</strong> $${finalAmount.toFixed(2)}</p>
          <p><strong>Método de Pago:</strong> ${paymentType}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Gracias por su pago.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ 
      success: true, 
      finalAmount,
      notifications: {
        email: notificationDetails.email ? 'sent' : 'not_requested',
        sms: notificationDetails.phone ? 'sent' : 'not_requested'
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message,
      notifications: {
        email: 'failed',
        sms: 'failed'
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Payment API running at http://localhost:${port}`);
});