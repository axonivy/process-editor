import { EMPTY_ROLE, type RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { useMemo } from 'react';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';

export const useRoles = (showTaskRoles = false) => {
  const { context, elementContext } = useEditorContext();
  const roleTree = useMeta('meta/workflow/roleTree', context, EMPTY_ROLE).data;
  const taskRoles = useMeta('meta/workflow/taskRoles', elementContext, []).data;

  const { roles, rolesAsTree } = useMemo(() => {
    const flatRoles: string[] = [];
    const treeRoles: RoleMeta[] = [];
    const addFlatRoles = (role: RoleMeta) => {
      flatRoles.push(role.id);
      role.children.forEach(addFlatRoles);
    };
    if (showTaskRoles) {
      taskRoles.forEach(role => {
        treeRoles.push(role);
        addFlatRoles(role);
      });
    }
    treeRoles.push(roleTree);
    addFlatRoles(roleTree);
    return { roles: flatRoles, rolesAsTree: treeRoles };
  }, [roleTree, showTaskRoles, taskRoles]);

  return { rolesAsTree, roles, taskRoles };
};
