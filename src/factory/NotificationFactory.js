import { EmailNotificationHandler } from '../notification/EmailNotificationHandler.js';
import { SMSNotificationHandler } from '../notification/SMSNotificationHandler.js';

export class NotificationFactory {
  createNotificationHandler(type) {
    switch (type) {
      case 'EMAIL':
        return new EmailNotificationHandler();
      case 'SMS':
        return new SMSNotificationHandler();
      default:
        throw new Error(`Notification type '${type}' is not supported`);
    }
  }
}