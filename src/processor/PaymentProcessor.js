import { PaymentFactory } from '../factory/PaymentFactory.js';
import { NotificationFactory } from '../factory/NotificationFactory.js';

export class PaymentProcessor {
  constructor() {
    this.paymentFactory = new PaymentFactory();
    this.notificationFactory = new NotificationFactory();
  }

  processPayment(paymentType, amount, notificationDetails = {}) {
    if (!paymentType) {
      throw new Error('Payment type must be specified');
    }
    
    if (!amount || amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    
    try {
      const paymentHandler = this.paymentFactory.createPaymentHandler(paymentType);
      const finalAmount = paymentHandler.processPayment(amount);

      // Send notifications if details are provided
      if (notificationDetails.email) {
        const emailNotifier = this.notificationFactory.createNotificationHandler('EMAIL');
        emailNotifier.sendNotification(
          'Payment processed successfully',
          {
            email: notificationDetails.email,
            amount: finalAmount,
            paymentMethod: paymentType
          }
        );
      }

      if (notificationDetails.phone) {
        const smsNotifier = this.notificationFactory.createNotificationHandler('SMS');
        smsNotifier.sendNotification(
          'Payment processed successfully',
          {
            phone: notificationDetails.phone,
            amount: finalAmount,
            paymentMethod: paymentType
          }
        );
      }

      return finalAmount;
    } catch (error) {
      throw error;
    }
  }
}