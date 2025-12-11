import type { Size } from '../../models/Size';

export interface ISizeRepository {
  getAll(): Promise<Size[]>;
  getAllOrdered(): Promise<Size[]>;
  create(s: Size): Promise<Size>;
  update(id: string, partial: Partial<Size>): Promise<void>;
}
