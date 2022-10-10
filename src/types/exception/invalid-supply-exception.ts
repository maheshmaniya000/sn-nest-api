export class InvalidSupplyException extends Error {
  constructor(readonly inventoryId: string) {
    super('exception.invalid-supply-exception');
    this.name = 'InvalidSupplyException';
  }
}
