import type { ComboDefinition } from '../../models/Combo';

export interface IComboDefinitionRepository {
  getById(id: string): Promise<ComboDefinition | null>;
  getAll(): Promise<ComboDefinition[]>;
  create(c: ComboDefinition): Promise<ComboDefinition>;
  update(id: string, partial: Partial<ComboDefinition>): Promise<void>;
  delete(id: string): Promise<void>;
}
