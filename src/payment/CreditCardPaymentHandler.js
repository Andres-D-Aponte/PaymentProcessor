import { PaymentHandler } from './PaymentHandler.js';

/**
 * Concrete implementation of payment handler for Credit Card payments
 */
export class CreditCardPaymentHandler extends PaymentHandler {
  /**
   * Process a Credit Card payment
   * @param {number} amount - The payment amount
   * @returns {number} - The final amount after processing
   */
  processPayment(amount) {
    console.log('Processing payment with Credit Card');
    
    // Calculate commission
    const commissionRate = this.getCommissionRate();
    let finalAmount = amount + (amount * commissionRate);
    
    // Apply any additional charges
    const additionalCharge = this.calculateAdditionalCharges(amount);
    finalAmount += additionalCharge;
    
    return finalAmount;
  }

  /**
   * Get the commission rate for Credit Card payments
   * @returns {number} - The commission rate as a decimal
   */
  getCommissionRate() {
    return 0.03; // 3% commission for Credit Card
  }

  /**
   * Apply additional charges for Credit Card payments
   * @param {number} amount - The payment amount
   * @returns {number} - Additional charge amount
   */
  calculateAdditionalCharges(amount) {
    // For Credit Card, add $10 for amounts over $1000
    if (amount > 1000) {
      return 10;
    }
    return 0;
  }
}