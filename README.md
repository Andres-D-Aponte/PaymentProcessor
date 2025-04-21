# Payment Processing Application

A refactored payment processing application that demonstrates the Factory Method design pattern. This application provides a flexible and extensible framework for handling different payment methods.

## Features

- Modular design with separation of concerns
- Factory Method pattern for creating payment handlers
- Support for Credit Card, Debit Card, and PayPal payment methods
- Easy extensibility for adding new payment methods
- Clear error handling and validation

## Design Principles Applied

- **Open/Closed Principle**: The application is open for extension (new payment methods) but closed for modification.
- **Single Responsibility Principle**: Each class has a single responsibility.
- **Low Coupling**: Components have minimal dependencies on each other.
- **High Cohesion**: Related functionality is grouped together.
- **Factory Method Pattern**: Creates objects without specifying the exact class to create.

## How to Run

```bash
npm start
```

## Project Structure

- `src/payment/` - Contains payment handler classes
  - `PaymentHandler.js` - Abstract class defining the payment handler interface
  - `CreditCardPaymentHandler.js` - Handles Credit Card payments
  - `DebitCardPaymentHandler.js` - Handles Debit Card payments
  - `PayPalPaymentHandler.js` - Handles PayPal payments
- `src/factory/` - Contains factory classes
  - `PaymentFactory.js` - Creates payment handlers based on payment type
- `src/processor/` - Contains processor classes
  - `PaymentProcessor.js` - Main processor that delegates to specific handlers
- `index.js` - Main application entry point

## Extending the Application

To add a new payment method:

1. Create a new payment handler class that extends `PaymentHandler`
2. Implement the required methods: `processPayment()`, `getCommissionRate()`, and `calculateAdditionalCharges()`
3. Add the new payment type to the `PaymentFactory` class

Example of adding a new Bitcoin payment handler:

```javascript
// 1. Create BitcoinPaymentHandler.js
import { PaymentHandler } from './PaymentHandler.js';

export class BitcoinPaymentHandler extends PaymentHandler {
  processPayment(amount) {
    console.log('Processing payment with Bitcoin');
    
    const commissionRate = this.getCommissionRate();
    let finalAmount = amount + (amount * commissionRate);
    
    const additionalCharge = this.calculateAdditionalCharges(amount);
    finalAmount += additionalCharge;
    
    return finalAmount;
  }

  getCommissionRate() {
    return 0.01; // 1% commission for Bitcoin
  }

  calculateAdditionalCharges(amount) {
    if (amount > 2000) {
      return 15;
    }
    return 0;
  }
}

// 2. Update PaymentFactory.js to include the new handler
import { BitcoinPaymentHandler } from '../payment/BitcoinPaymentHandler.js';

// In the createPaymentHandler method, add:
case 'BITCOIN':
  return new BitcoinPaymentHandler();
```