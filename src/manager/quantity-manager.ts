import { ItemDoesNotExistException, InvalidItemQuantityException } from '../types';

export class QuantityManager {
  protected items: Map<string, number> = new Map();

  add(id: string, quantity = 1): void {
    if (this.has(id)) this.items.set(id, this.getQuantity(id) + quantity);
    else this.items.set(id, quantity);
  }

  getIds(): string[] {
    return Array.from(this.items.keys());
  }

  getQuantity(id: string): number {
    this.throwIfItemDoesNotExists(id);
    return this.items.get(id);
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  remove(id: string, quantity = 1): void {
    this.throwIfItemDoesNotExists(id);
    const currentQuantity = this.getQuantity(id);
    if (currentQuantity < quantity) throw new InvalidItemQuantityException(id, quantity);
    else if (currentQuantity === quantity) this.items.delete(id);
    else this.items.set(id, currentQuantity - quantity);
  }

  removeAll(id: string): void {
    this.throwIfItemDoesNotExists(id);
    this.items.delete(id);
  }

  throwIfItemDoesNotExists(id: string): void {
    if (!this.has(id)) throw new ItemDoesNotExistException(id);
  }

  updateQuantity(id: string, quantity: number): void {
    this.throwIfItemDoesNotExists(id);
    this.items.set(id, quantity);
  }
}
