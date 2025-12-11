import { useState, useCallback, useEffect } from 'react';
import type { SystemSettings } from '../models/SystemSettings';
import type { Rule } from '../models/Rules';
import type { ISystemSettingsRepository } from '../repos/interfaces/ISystemSettingsRepository';
import type { IRulesRepository } from '../repos/interfaces/IRulesRepository';
import { AdminService } from '../services/domain/AdminService';

export function useAdmin(settingsRepo: ISystemSettingsRepository, rulesRepo: IRulesRepository) {
  const service = new AdminService(settingsRepo, rulesRepo);

  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await service.getSettings();
      const r = await service.getRules();
      setSettings(s);
      setRules(r);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (partial: Partial<SystemSettings>) => {
    await service.updateSettings(partial);
    await load();
  }, []);

  const saveRule = useCallback(async (r: Partial<Rule>) => {
    await service.saveRule(r);
    await load();
  }, []);

  useEffect(() => {
    load();
  }, []);

  return { settings, rules, loading, saveSettings, saveRule, refresh: load };
}
