export class WalletTokenEntity {
  constructor(
    readonly id: string,
    readonly appliedItemIds: string[],
    readonly parkedItemIds: string[],
  ) {}
}
