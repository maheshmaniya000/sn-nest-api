import {
  InvalidOrderStatusException,
  ItemDoesExistException,
  ItemDoesNotExistException,
  OrderStatus,
  PaymentEndedException,
  PaymentNotFoundException,
  PaymentProvider,
  PaymentStartedException,
} from '../types';
import { PaymentEntity } from './payment-entity';

type OrderItem = { price: number, quantity: number };

export class OrderEntity {
  constructor(
    private readonly id: string,
    private readonly walletId: string,
    private items = new Map<string, OrderItem>(),
    private status = OrderStatus.STARTED,
    private payments: PaymentEntity[],
  ) {}

  isCanceled(): boolean {
    return this.status === OrderStatus.CANCELED;
  }

  isFulfilled(): boolean {
    return this.status === OrderStatus.FULFILLED;
  }

  addItem(itemId: string, item: OrderItem): void {
    if (this.hasItemId(itemId)) throw new ItemDoesExistException(itemId);
    this.items.set(itemId, item);
  }

  cancel(): void {
    this.throwIfPaymentStarted();
    if (this.isCanceled()) throw new InvalidOrderStatusException(this.id, this.status);
    if (this.isFulfilled()) throw new InvalidOrderStatusException(this.id, this.status);
    this.status = OrderStatus.CANCELED;
  }

  cancelPayment(rawResponse: string): void {
    this.getCurrentPayment().cancel(rawResponse);
  }

  fail(): void {
    this.status = OrderStatus.FAILED;
  }

  failPayment(rawResponse: string): void {
    this.throwIfPaymentEnded();
    this.getCurrentPayment().fail(rawResponse);
  }

  fulfill(): void {
    this.status = OrderStatus.FULFILLED;
  }

  startPayment(paymentId: string, paymentProvider: PaymentProvider, paymentUrl: string): void {
    this.throwIfPaymentStarted();
    this.payments.push(new PaymentEntity(paymentId, paymentProvider, paymentUrl));
  }

  succeedPayment(rawResponse: string): void {
    this.throwIfPaymentEnded();
    this.getCurrentPayment().success(rawResponse);
  }

  removeItem(itemId: string): void {
    if (!this.hasItemId(itemId)) throw new ItemDoesNotExistException(itemId);
    this.items.delete(itemId);
  }

  private getCurrentPayment(): PaymentEntity {
    if (!this.hasPayment()) throw new PaymentNotFoundException();
    return this.payments[this.payments.length - 1];
  }

  private hasItemId(itemId: string): boolean {
    return this.items.has(itemId);
  }

  private hasPayment(): boolean {
    return this.payments.length > 0;
  }

  private throwIfPaymentEnded(): void {
    if (this.getCurrentPayment().isEnded()) {
      throw new PaymentEndedException(this.getCurrentPayment().provider);
    }
  }

  private throwIfPaymentStarted(): void {
    if (this.hasPayment() && this.getCurrentPayment().isStarted()) {
      throw new PaymentStartedException(this.getCurrentPayment().provider);
    }
  }
}
