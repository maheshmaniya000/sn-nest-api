import { PaymentEndedException, PaymentProvider, PaymentStatus } from '../types';

export class PaymentEntity {
  private rawCancelResponse: string;
  private rawFailedResponse: string;
  private rawSuccessResponse: string;

  constructor(
    readonly id: string,
    readonly provider: PaymentProvider,
    private url: string,
    private status = PaymentStatus.STARTED,
  ) {}

  setRawCancelResponse(rawResponse: string): this {
    this.rawCancelResponse = rawResponse;
    return this;
  }

  setRawFailedResponse(rawResponse: string): this {
    this.rawFailedResponse = rawResponse;
    return this;
  }

  setRawSuccessResponse(rawResponse: string): this {
    this.rawSuccessResponse = rawResponse;
    return this;
  }

  cancel(rawResponse: string): void {
    if (this.isEnded()) throw new PaymentEndedException(this.provider);
    this.status = PaymentStatus.CANCELED;
    this.rawCancelResponse = rawResponse;
    this.url = null;
  }

  fail(rawResponse: string): void {
    if (this.isEnded()) throw new PaymentEndedException(this.provider);
    this.rawFailedResponse = rawResponse;
    this.status = PaymentStatus.FAILED;
  }

  success(rawResponse: string): void {
    if (this.isEnded()) throw new PaymentEndedException(this.provider);
    this.rawSuccessResponse = rawResponse;
    this.status = PaymentStatus.SUCCEEDED;
  }

  isStarted(): boolean {
    return this.status === PaymentStatus.STARTED;
  }

  isEnded(): boolean {
    return [
      PaymentStatus.CANCELED,
      PaymentStatus.FAILED,
      PaymentStatus.SUCCEEDED,
    ].includes(this.status);
  }
}
