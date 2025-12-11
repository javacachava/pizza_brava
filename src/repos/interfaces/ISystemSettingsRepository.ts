import type { SystemSettings } from '../../models/SystemSettings';

export interface ISystemSettingsRepository {
  getSettings(): Promise<SystemSettings>;
  updateSettings(partial: Partial<SystemSettings>): Promise<void>;
}
