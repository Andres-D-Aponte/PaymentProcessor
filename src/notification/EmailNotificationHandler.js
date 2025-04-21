import { NotificationHandler } from './NotificationHandler.js';
import { EmailNotificationBuilder } from './NotificationBuilder.js';

export class EmailNotificationHandler extends NotificationHandler {
  sendNotification(details) {
    const notification = new EmailNotificationBuilder()
      .setTo(details.email)
      .setSubject('Payment Confirmation')
      .setBody(`Your payment of $${details.amount} via ${details.paymentMethod} has been processed successfully.`)
      .setPriority('high')
      .build();

    console.log('Sending Email notification:', notification);
    return notification;
  }
}