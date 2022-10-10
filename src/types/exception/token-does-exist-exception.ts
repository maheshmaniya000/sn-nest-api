export class TokenDoesExistException extends Error {
  constructor(readonly tokenId: string) {
    super('exception.token-does-exist');
    this.name = 'TokenDoesExistException';
  }
}
