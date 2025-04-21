import { NotificationHandler } from './NotificationHandler.js';
import { SMSNotificationBuilder } from './NotificationBuilder.js';

export class SMSNotificationHandler extends NotificationHandler {
  sendNotification(details) {
    const notification = new SMSNotificationBuilder()
      .setPhoneNumber(details.phone)
      .setMessage(`Payment of $${details.amount} via ${details.paymentMethod} processed successfully.`)
      .setDeliveryReportRequired(true)
      .build();

    console.log('Sending SMS notification:', notification);
    return notification;
  }
}