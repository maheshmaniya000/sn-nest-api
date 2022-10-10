import { QuantityManager } from '../manager/quantity-manager';
import { TokenManager } from '../manager/token-manager';
import { ItemEntityRepository } from '../repository/item-entity-repository';
import { ItemNotSupportedException, ItemRestrictedException } from '../types';
import { BlockchainTokenEntity } from './blockchain-token-entity';
import { ItemEntity } from './item-entity';

export class WalletEntity {
  private id: string;
  private cartManager: QuantityManager;
  private itemManager: QuantityManager;
  private tokenManager: TokenManager;

  addItem(itemId: string, quantity: number): void {
    this.itemManager.add(itemId, quantity);
  }

  addItemToCart(itemId: string, quantity: number): void {
    this.cartManager.add(itemId, quantity);
  }

  addToken(tokenId: string): void {
    this.tokenManager.throwIfTokenDoesExists(tokenId);
    this.tokenManager.add(tokenId);
  }

  async applyItem(
    item: ItemEntity,
    token: BlockchainTokenEntity,
    itemEntityRepository: ItemEntityRepository,
  ): Promise<void> {
    if (item.isRestricted) throw new ItemRestrictedException(item.id);
    if (!item.isTokenConfigIdSupported(token.configId)) {
      throw new ItemNotSupportedException(item.id);
    }

    this.tokenManager.throwIfAppliedItemDoesExists(token.id, item.id);
    const tokenItems = await itemEntityRepository.getByIds(token.itemIds);
    item
      .filterIncompatibleItems(tokenItems)
      .filter((x) => !this.tokenManager.hasParkedItem(token.id, x.id))
      .forEach((x) => { this.addItemToParking(x.id, token.id); });

    const appliedItemIds = this.tokenManager.getAppliedItems(token.id);
    const appliedItems = await itemEntityRepository.getByIds(appliedItemIds);
    item
      .filterIncompatibleItems(appliedItems)
      .forEach((x) => { this.moveItemFromTokenToWallet(x.id, token.id); });

    if (this.tokenManager.hasParkedItem(token.id, item.id)) {
      this.removeItemFromParking(item.id, token.id);
    } else this.moveItemFromWalletToToken(item.id, token.id);
  }

  removeItem(itemId: string): void {
    this.itemManager.remove(itemId);
  }

  removeItemFromCart(itemId: string): void {
    this.cartManager.remove(itemId);
  }

  removeToken(tokenId: string): this {
    this.tokenManager.throwIfTokenDoesNotExists(tokenId);
    this.tokenManager
      .getAppliedItems(tokenId)
      .forEach((x) => { this.moveItemFromTokenToWallet(x, tokenId); });
    this.tokenManager.remove(tokenId);
    return this;
  }

  sync(tokens: BlockchainTokenEntity[]): void {
    const newTokenIds = tokens.map((x) => x.id);
    const oldTokenIds = this.tokenManager.getIds();
    const areSameIds = newTokenIds.sort().toString() === oldTokenIds.sort().toString();
    if (areSameIds) return;

    newTokenIds
      .filter((x) => !oldTokenIds.includes(x))
      .forEach((x) => { this.addToken(x); });

    oldTokenIds
      .filter((x) => !newTokenIds.includes(x))
      .forEach((x) => { this.removeToken(x); });
  }

  unapplyItem(itemId: string, token: BlockchainTokenEntity): void {
    if (token.hasItem(itemId)) this.addItemToParking(itemId, token.id);
    else this.moveItemFromTokenToWallet(itemId, token.id);
  }

  updateItemQuantityInCart(itemId: string, quantity: number): void {
    this.cartManager.updateQuantity(itemId, quantity);
  }

  private addItemToParking(itemId: string, tokenId: string): void {
    this.tokenManager.throwIfParkedItemDoesExists(tokenId, itemId);
    this.tokenManager.addItemToParking(tokenId, itemId);
  }

  private moveItemFromTokenToWallet(itemId: string, tokenId: string): void {
    this.tokenManager.throwIfAppliedItemDoesNotExists(tokenId, itemId);
    this.itemManager.add(itemId);
  }

  private moveItemFromWalletToToken(itemId: string, tokenId: string): void {
    this.itemManager.throwIfItemDoesNotExists(itemId);
    this.tokenManager.addItemToApplied(tokenId, itemId);
    this.itemManager.remove(itemId);
  }

  private removeItemFromParking(itemId: string, tokenId: string): void {
    this.tokenManager.throwIfParkedItemDoesNotExists(tokenId, itemId);
    this.tokenManager.removeItemFromParking(tokenId, itemId);
  }
}
