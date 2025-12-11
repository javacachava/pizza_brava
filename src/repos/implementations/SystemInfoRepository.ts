import { BaseRepository } from '../BaseRepository';
import type { SystemSettings } from '../../models/SystemSettings';
import type { ISystemSettingsRepository } from '../interfaces/ISystemSettingsRepository';

export class SystemInfoRepository extends BaseRepository<SystemSettings> implements ISystemSettingsRepository {
  constructor() { super('system_settings'); }
  async getSettings(): Promise<SystemSettings> {
    // singleton doc id
    const docId = 'main_config';
    const s = await this.getById(docId);
    if (s) return s;
    const defaults: SystemSettings = { id: docId, currency: 'USD', taxRate: 0, enableStockManagement: false };
    await this.create({ ...defaults, id: docId });
    return defaults;
  }

  async updateSettings(partial: Partial<SystemSettings>): Promise<void> {
    const docId = 'main_config';
    await this.update(docId, partial as Partial<SystemSettings>);
  }
}
