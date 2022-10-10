export class BlockchainTokenEntity {
  readonly id: string;

  constructor(
    readonly backgroundId: string,
    readonly configId: string,
    readonly contractId: string,
    readonly index: number,
    readonly itemIds: string[],
  ) {
    this.id = `${this.contractId}--${this.index}`;
  }

  hasItem(itemId: string): boolean {
    return this.itemIds.includes(itemId);
  }
}
