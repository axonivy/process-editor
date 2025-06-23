import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { deepEqual } from '../../../utils/equals';
import type { IvyIcons } from '@axonivy/ui-icons';

export type PartStateFlag = 'configured' | 'warning' | 'error' | undefined;

export type PartState = {
  state: PartStateFlag;
  validations: ValidationResult[];
};

export type PartProps = {
  id: string;
  name: string;
  state: PartState;
  content: ReactNode;
  icon: IvyIcons;
  control?: ReactNode;
};

export function usePartState(defaultData: unknown, data: unknown, validations: ValidationResult[]): PartState {
  const state = useMemo(() => {
    if (validations.find(message => message?.severity === 'ERROR')) {
      return 'error';
    }
    if (validations.find(message => message?.severity === 'WARNING')) {
      return 'warning';
    }
    return deepEqual(data, defaultData) ? undefined : 'configured';
  }, [validations, data, defaultData]);
  return { state, validations };
}

export function usePartDirty(initData: unknown, data: unknown): boolean {
  return useMemo<boolean>(() => {
    return !deepEqual(data, initData);
  }, [data, initData]);
}

const INSCRIPTIONTAB_STORAGE_KEY = 'process-inscription-tab';

export const useInscriptionTabState = (parts: Array<PartProps>) => {
  const [value, setValue] = useState(() => {
    try {
      const storage = sessionStorage.getItem(INSCRIPTIONTAB_STORAGE_KEY) ?? '[]';
      const states = JSON.parse(storage) as Array<string>;
      return parts.find(part => states.includes(part.id))?.id ?? 'General';
    } catch {
      console.error('Error reading from sessionStorage');
      return '';
    }
  });
  const updateValue = (value: string) => {
    setValue(old => {
      try {
        const storage = sessionStorage.getItem(INSCRIPTIONTAB_STORAGE_KEY) ?? '[]';
        let states = JSON.parse(storage) as Array<string>;
        if (states.includes(old)) {
          states.splice(states.indexOf(old), 1);
        }
        if (value) {
          states = [value, ...states];
        }
        sessionStorage.setItem(INSCRIPTIONTAB_STORAGE_KEY, JSON.stringify(states));
      } catch {
        console.error('Error store to sessionStorage');
      }
      return value;
    });
  };
  return { value, updateValue };
};
