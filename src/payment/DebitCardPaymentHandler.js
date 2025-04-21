import { PaymentHandler } from './PaymentHandler.js';

/**
 * Concrete implementation of payment handler for Debit Card payments
 */
export class DebitCardPaymentHandler extends PaymentHandler {
  /**
   * Process a Debit Card payment
   * @param {number} amount - The payment amount
   * @returns {number} - The final amount after processing
   */
  processPayment(amount) {
    console.log('Processing payment with Debit Card');
    
    // Calculate commission
    const commissionRate = this.getCommissionRate();
    let finalAmount = amount + (amount * commissionRate);
    
    // Apply any additional charges
    const additionalCharge = this.calculateAdditionalCharges(amount);
    finalAmount += additionalCharge;
    
    return finalAmount;
  }

  /**
   * Get the commission rate for Debit Card payments
   * @returns {number} - The commission rate as a decimal
   */
  getCommissionRate() {
    return 0.01; // 1% commission for Debit Card
  }

  /**
   * Apply additional charges for Debit Card payments
   * @param {number} amount - The payment amount
   * @returns {number} - Additional charge amount
   */
  calculateAdditionalCharges(amount) {
    // For Debit Card, add $5 for amounts over $500
    if (amount > 500) {
      return 5;
    }
    return 0;
  }
}