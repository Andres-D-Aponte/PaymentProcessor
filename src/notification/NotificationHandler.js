export class NotificationHandler {
  constructor() {
    if (this.constructor === NotificationHandler) {
      throw new Error('NotificationHandler is an abstract class and cannot be instantiated directly');
    }
  }

  sendNotification(notification) {
    throw new Error('Method sendNotification() must be implemented by subclasses');
  }
}