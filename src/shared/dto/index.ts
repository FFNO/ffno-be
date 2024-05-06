export * from './auth';
export * from './common';
export * from './equipments';
export * from './invoices';
export * from './members';
export * from './properties';
export * from './requests';
export * from './units';

export interface NotificationPayload {
  title: string;
  content: string;
  memberId: string;
}

export interface EmailPayload<T = any> {
  to: string;
  subject: string;
  template: string;
  context: T;
}