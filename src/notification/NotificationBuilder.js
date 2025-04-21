export class EmailNotificationBuilder {
  constructor() {
    this.notification = {
      to: '',
      subject: '',
      body: '',
      cc: [],
      bcc: [],
      attachments: [],
      priority: 'normal'
    };
  }

  setTo(to) {
    this.notification.to = to;
    return this;
  }

  setSubject(subject) {
    this.notification.subject = subject;
    return this;
  }

  setBody(body) {
    this.notification.body = body;
    return this;
  }

  setCc(cc) {
    this.notification.cc = cc;
    return this;
  }

  setBcc(bcc) {
    this.notification.bcc = bcc;
    return this;
  }

  setAttachments(attachments) {
    this.notification.attachments = attachments;
    return this;
  }

  setPriority(priority) {
    this.notification.priority = priority;
    return this;
  }

  build() {
    return { ...this.notification };
  }
}

export class SMSNotificationBuilder {
  constructor() {
    this.notification = {
      phoneNumber: '',
      message: '',
      senderId: '',
      deliveryReportRequired: false,
      scheduleTime: null
    };
  }

  setPhoneNumber(phoneNumber) {
    this.notification.phoneNumber = phoneNumber;
    return this;
  }

  setMessage(message) {
    this.notification.message = message;
    return this;
  }

  setSenderId(senderId) {
    this.notification.senderId = senderId;
    return this;
  }

  setDeliveryReportRequired(required) {
    this.notification.deliveryReportRequired = required;
    return this;
  }

  setScheduleTime(time) {
    this.notification.scheduleTime = time;
    return this;
  }

  build() {
    return { ...this.notification };
  }
}