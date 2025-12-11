import { useState, useCallback, useEffect } from 'react';
import type { ComboDefinition } from '../models/ComboDefinition';
import type { Combo } from '../models/Combo';

import type { IComboDefinitionRepository } from '../repos/interfaces/IComboDefinitionRepository';
import type { IComboRepository } from '../repos/interfaces/IComboRepository';
import { ComboService } from '../services/domain/ComboService';

export function useCombo(defRepo: IComboDefinitionRepository, instRepo: IComboRepository) {
  const service = new ComboService(instRepo, defRepo);

  const [definitions, setDefinitions] = useState<ComboDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDefinitions(await service.getDefinitions());
    } finally {
      setLoading(false);
    }
  }, []);

  const createDefinition = useCallback(async (def: Partial<ComboDefinition>) => {
    await service.createDefinition(def);
    await load();
  }, []);

  const updateDefinition = useCallback(async (id: string, partial: Partial<ComboDefinition>) => {
    await service.updateDefinition(id, partial);
    await load();
  }, []);

  const generateInstance = useCallback(
    (def: ComboDefinition, selections: Record<string, string[]>): Combo => {
      return service.generateCombo(def, selections);
    },
    []
  );

  useEffect(() => {
    load();
  }, []);

  return { definitions, loading, createDefinition, updateDefinition, generateInstance, refresh: load };
}
