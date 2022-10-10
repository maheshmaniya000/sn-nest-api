export class PaymentNotFoundException extends Error {
  constructor() {
    super('exception.payment-not-found-exception');
    this.name = 'PaymentNotFoundException';
  }
}
