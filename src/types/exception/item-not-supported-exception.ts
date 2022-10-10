export class ItemNotSupportedException extends Error {
  constructor(readonly itemId: string) {
    super('exception.item-not-supported');
    this.name = 'ItemNotSupportedException';
  }
}
