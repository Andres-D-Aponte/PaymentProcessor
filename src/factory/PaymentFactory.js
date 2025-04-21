import { CreditCardPaymentHandler } from '../payment/CreditCardPaymentHandler.js';
import { DebitCardPaymentHandler } from '../payment/DebitCardPaymentHandler.js';
import { PayPalPaymentHandler } from '../payment/PayPalPaymentHandler.js';

/**
 * Factory class that creates payment handlers based on payment type
 * Follows the Factory Method pattern
 */
export class PaymentFactory {
  /**
   * Create a payment handler based on the payment type
   * @param {string} paymentType - The type of payment (e.g., 'CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL')
   * @returns {PaymentHandler} - A concrete payment handler
   * @throws {Error} - If the payment type is not supported
   */
  createPaymentHandler(paymentType) {
    switch (paymentType) {
      case 'CREDIT_CARD':
        return new CreditCardPaymentHandler();
      case 'DEBIT_CARD':
        return new DebitCardPaymentHandler();
      case 'PAYPAL':
        return new PayPalPaymentHandler();
      default:
        throw new Error(`Payment method '${paymentType}' is not supported`);
    }
  }
}