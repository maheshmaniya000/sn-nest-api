export class ItemEntity {
  constructor(
    readonly id: string,
    readonly groupId: string,
    readonly isLive: boolean,
    readonly isRestricted: boolean,
    readonly price: number,
    readonly removeGroupIds: string[],
    readonly supportedTokenConfigIds: string[],
    readonly maxSupply: number,
    readonly layers: string[],
    readonly name: string,
    readonly quantity: number,
    readonly rarityLevel: string,
    readonly drop: string,
  ) {}

  filterIncompatibleItems(items: ItemEntity[]): ItemEntity[] {
    return items.filter((x) => this.removeGroupIds.includes(x.groupId));
  }

  isTokenConfigIdSupported(tokenConfigId: string): boolean {
    return this.supportedTokenConfigIds.includes(tokenConfigId);
  }
}
