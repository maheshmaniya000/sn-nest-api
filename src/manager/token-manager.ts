import { WalletTokenEntity } from '../entity/wallet-token-entity';
import {
  ItemDoesExistException,
  ItemDoesNotExistException,
  TokenDoesExistException,
  TokenDoesNotExistException,
} from '../types';

type Token = { appliedItems: Set<string>, parkedItems: Set<string> };

export class TokenManager {
  private tokens: Map<string, Token> = new Map();

  add(id: string): void {
    this.tokens.set(id, { appliedItems: new Set<string>(), parkedItems: new Set<string>() });
  }

  addItemToApplied(id: string, itemId: string): void {
    this.tokens.get(id).appliedItems.add(itemId);
  }

  addItemToParking(id: string, itemId: string): void {
    this.tokens.get(id).parkedItems.add(itemId);
  }

  getAppliedItems(id: string): string[] {
    return Array.from(this.tokens.get(id).appliedItems);
  }

  getParkedItems(id: string): string[] {
    return Array.from(this.tokens.get(id).parkedItems);
  }

  getIds(): string[] {
    return Array.from(this.tokens.keys());
  }

  getAll(): WalletTokenEntity[] {
    return Array.from(this.tokens.keys()).map((id) => this.get(id));
  }

  get(id: string): WalletTokenEntity {
    return new WalletTokenEntity(id, this.getAppliedItems(id), this.getParkedItems(id));
  }

  has(id: string): boolean {
    return this.tokens.has(id);
  }

  hasAppliedItem(id: string, itemId: string): boolean {
    return this.tokens.get(id).appliedItems.has(itemId);
  }

  hasParkedItem(id: string, itemId: string): boolean {
    return this.tokens.get(id).parkedItems.has(itemId);
  }

  remove(id: string): void {
    this.tokens.delete(id);
  }

  removeItemFromApplied(id: string, itemId: string): void {
    this.tokens.get(id).appliedItems.delete(itemId);
  }

  removeItemFromParking(id: string, itemId: string): void {
    this.tokens.get(id).parkedItems.delete(itemId);
  }

  throwIfAppliedItemDoesExists(id: string, itemId: string): void {
    if (this.hasAppliedItem(id, itemId)) throw new ItemDoesExistException(itemId);
  }

  throwIfAppliedItemDoesNotExists(id: string, itemId: string): void {
    if (!this.hasAppliedItem(id, itemId)) throw new ItemDoesNotExistException(itemId);
  }

  throwIfParkedItemDoesExists(id: string, itemId: string): void {
    if (this.hasParkedItem(id, itemId)) throw new ItemDoesExistException(itemId);
  }

  throwIfParkedItemDoesNotExists(id: string, itemId: string): void {
    if (!this.hasParkedItem(id, itemId)) throw new ItemDoesNotExistException(itemId);
  }

  throwIfTokenDoesExists(id: string): void {
    if (this.has(id)) throw new TokenDoesExistException(id);
  }

  throwIfTokenDoesNotExists(id: string): void {
    if (!this.has(id)) throw new TokenDoesNotExistException(id);
  }
}
