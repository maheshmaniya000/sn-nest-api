import { InvalidSupplyException } from '../types';
import { ItemEntity } from './item-entity';

export class ItemInventoryEntity {
  constructor(
    private readonly id: string,
    private supplied = 0,
  ) {}

  supplyIn(quantity: number): void {
    if (this.supplied < quantity) throw new InvalidSupplyException(this.id);
    this.supplied -= quantity;
  }

  supplyOut(item: ItemEntity, quantity: number): void {
    this.throwIfNotEnoughSupply(item, quantity);
    this.supplied += quantity;
  }

  private throwIfNotEnoughSupply(item: ItemEntity, quantity: number): void {
    const suppliedAfter = this.supplied + quantity;
    if (suppliedAfter > item.maxSupply) throw new InvalidSupplyException(this.id);
  }
}
