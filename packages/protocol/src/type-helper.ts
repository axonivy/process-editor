import type { Action } from '@eclipse-glsp/protocol';

export type CreateOptionHelper<T extends Action> = (options: Omit<T, 'kind'>) => T;
