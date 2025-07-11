import type { AlternativeConditions, ConnectorRef, NodeRef } from '@axonivy/process-editor-inscription-protocol';
import { arraymove, indexOf } from '../../../utils/array';
import { PID } from '../../../utils/pid';

export interface Condition {
  fid: string;
  expression: string;
  target?: NodeRef;
}

export namespace Condition {
  export function of(altConditions: AlternativeConditions): Condition[] {
    return Object.entries(altConditions).map(cond => {
      return { fid: cond[0], expression: cond[1] };
    });
  }

  export function replace(conditions: Condition[], connectorRef: ConnectorRef): Condition[] {
    if (connectorRef === undefined || connectorRef === null) {
      return conditions;
    }
    return conditions.map(cond => {
      if (cond.fid === PID.fieldId(connectorRef.pid)) {
        cond.target = connectorRef.target;
      }
      return cond;
    });
  }

  export function update(conditions: Condition[], rowIndex: number, columnId: string, value: string): Condition[] {
    return conditions.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [columnId]: value
        };
      }
      return row;
    });
  }

  export function remove(conditions: Condition[], id: string): Condition[] {
    const index = indexOf(conditions, obj => obj.fid === id);
    conditions.splice(index, 1);
    return conditions;
  }

  export function move(conditions: Condition[], moveId: string, targetId: string): Condition[] {
    const fromIndex = indexOf(conditions, obj => obj.fid === moveId);
    const toIndex = indexOf(conditions, obj => obj.fid === targetId);
    arraymove(conditions, fromIndex, toIndex);
    return conditions;
  }

  export function to(conditions: Condition[]): AlternativeConditions {
    const altConditions: AlternativeConditions = {};
    conditions.forEach(cond => (altConditions[cond.fid] = cond.expression));
    return altConditions;
  }
}
