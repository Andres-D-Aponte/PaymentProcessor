import { PaymentHandler } from './PaymentHandler.js';

/**
 * Concrete implementation of payment handler for PayPal payments
 */
export class PayPalPaymentHandler extends PaymentHandler {
  /**
   * Process a PayPal payment
   * @param {number} amount - The payment amount
   * @returns {number} - The final amount after processing
   */
  processPayment(amount) {
    console.log('Processing payment with PayPal');
    
    // Calculate commission
    const commissionRate = this.getCommissionRate();
    let finalAmount = amount + (amount * commissionRate);
    
    // Apply any additional charges
    const additionalCharge = this.calculateAdditionalCharges(amount);
    finalAmount += additionalCharge;
    
    return finalAmount;
  }

  /**
   * Get the commission rate for PayPal payments
   * @returns {number} - The commission rate as a decimal
   */
  getCommissionRate() {
    return 0.02; // 2% commission for PayPal
  }

  /**
   * Apply additional charges for PayPal payments
   * @param {number} amount - The payment amount
   * @returns {number} - Additional charge amount
   */
  calculateAdditionalCharges(amount) {
    // For PayPal, add $7 for amounts over $750
    if (amount > 750) {
      return 7;
    }
    return 0;
  }
}