export class ItemRestrictedException extends Error {
  constructor(readonly itemId: string) {
    super('exception.item-restricted');
    this.name = 'ItemRestrictedException';
  }
}
