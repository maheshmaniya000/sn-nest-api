export class ItemDoesExistException extends Error {
  constructor(readonly itemId: string) {
    super('exception.item-does-exist');
    this.name = 'ItemDoesExistException';
  }
}
