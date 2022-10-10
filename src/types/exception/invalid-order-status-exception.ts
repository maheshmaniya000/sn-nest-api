export class InvalidOrderStatusException extends Error {
  constructor(readonly orderId: string, readonly status: string) {
    super('exception.invalid-order-status-exception');
    this.name = 'InvalidOrderStatusException';
  }
}
