import { Button, Flex, TableCell, useReadonly } from '@axonivy/ui-components';
import type { IvyIcons } from '@axonivy/ui-icons';
import './ActionCell.css';

interface Action {
  label: string;
  icon: IvyIcons;
  action: () => void;
  disabled?: boolean;
}

export const ActionCell = ({ actions }: { actions: Action[] }) => {
  const readonly = useReadonly();
  return (
    <TableCell className='action-cell' style={{ width: `${actions.length * 20}px` }}>
      <Flex direction='row' gap={1} justifyContent='flex-end'>
        {actions.map((action, index) => (
          <Button key={index} onClick={action.action} disabled={readonly || action.disabled} aria-label={action.label} icon={action.icon} />
        ))}
      </Flex>
    </TableCell>
  );
};
