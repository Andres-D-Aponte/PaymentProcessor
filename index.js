import express from 'express';
import cors from 'cors';
import { PaymentProcessor } from './src/processor/PaymentProcessor.js';

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

app.post('/process-payment', (req, res) => {
  try {
    const { paymentType, amount, notificationDetails } = req.body;
    const finalAmount = processor.processPayment(paymentType, amount, notificationDetails);
    res.json({ success: true, finalAmount });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Payment API running at http://localhost:${port}`);
});