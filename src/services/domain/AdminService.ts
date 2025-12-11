import type { ISystemSettingsRepository } from '../../repos/interfaces/ISystemSettingsRepository';
import type { IRulesRepository } from '../../repos/interfaces/IRulesRepository';
import type { SystemSettings } from '../../models/SystemSettings';
import type { Rule } from '../../models/Rules';

export class AdminService {
  private settingsRepo: ISystemSettingsRepository;
  private rulesRepo: IRulesRepository;

  constructor(
    settingsRepo: ISystemSettingsRepository,
    rulesRepo: IRulesRepository
  ) {
    this.settingsRepo = settingsRepo;
    this.rulesRepo = rulesRepo;
  }

  async getSettings(): Promise<SystemSettings> {
    return this.settingsRepo.getSettings();
  }

  async updateSettings(data: Partial<SystemSettings>) {
    return this.settingsRepo.updateSettings(data);
  }

  async getRules(): Promise<Rule[]> {
    return this.rulesRepo.getAll();
  }

  async saveRule(data: Partial<Rule>) {
    if (!data.key) throw new Error('La regla requiere una clave');
    if (data.id) return this.rulesRepo.update(data.id, data);
    return this.rulesRepo.create(data as Rule);
  }
}
