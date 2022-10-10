export class TokenDoesNotExistException extends Error {
  constructor(readonly tokenId: string) {
    super('exception.token-does-not-exist');
    this.name = 'TokenDoesNotExistException';
  }
}
