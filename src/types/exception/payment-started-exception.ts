import { PaymentProvider } from '../enum/payment-provider';

export class PaymentStartedException extends Error {
  constructor(readonly paymentProvider: PaymentProvider) {
    super('exception.payment-started-exception');
    this.name = 'PaymentStartedException';
  }
}
