/**
 * Abstract class that defines the interface for all payment handlers
 * Serves as a template for concrete payment handlers
 */
export class PaymentHandler {
  constructor() {
    // Ensure this class is not instantiated directly
    if (this.constructor === PaymentHandler) {
      throw new Error('PaymentHandler is an abstract class and cannot be instantiated directly');
    }
  }

  /**
   * Process a payment
   * @param {number} amount - The payment amount
   * @returns {number} - The final amount after processing
   */
  processPayment(amount) {
    throw new Error('Method processPayment() must be implemented by subclasses');
  }

  /**
   * Get the commission rate for this payment type
   * @returns {number} - The commission rate as a decimal
   */
  getCommissionRate() {
    throw new Error('Method getCommissionRate() must be implemented by subclasses');
  }

  /**
   * Apply additional charges based on payment-specific rules
   * @param {number} amount - The payment amount
   * @returns {number} - Additional charge amount
   */
  calculateAdditionalCharges(amount) {
    throw new Error('Method calculateAdditionalCharges() must be implemented by subclasses');
  }
}