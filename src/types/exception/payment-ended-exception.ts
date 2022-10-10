import { PaymentProvider } from '../enum/payment-provider';

export class PaymentEndedException extends Error {
  constructor(readonly paymentProvider: PaymentProvider) {
    super('exception.payment-started-exception');
    this.name = 'PaymentEndedException';
  }
}
