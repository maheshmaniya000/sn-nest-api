import { ItemEntity } from '../entity/item-entity';

export interface ItemEntityRepository {
  getById(id: string): Promise<ItemEntity>;
  getByIds(ids: string[]): Promise<ItemEntity[]>;
}
