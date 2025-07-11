import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { CellContext } from '@tanstack/react-table';
import IvyIcon from '../../IvyIcon';
import './ExpandableCell.css';

type ExpandableCellProps<TData> = {
  cell: CellContext<TData, string>;
  isLoaded?: boolean;
  loadChildren?: () => void;
  isUnknown?: boolean;
  icon?: IvyIcons;
  title?: string;
  additionalInfo?: string;
};

export function ExpandableCell<TData>({
  cell,
  isLoaded,
  loadChildren,
  isUnknown,
  icon,
  title,
  additionalInfo
}: ExpandableCellProps<TData>) {
  const row = cell.row;
  const onClick = () => {
    if (isLoaded === false && loadChildren) {
      loadChildren();
    }
    row.toggleExpanded(true);
  };
  return (
    <Flex
      alignItems='center'
      gap={1}
      className='row-expand'
      style={{
        paddingLeft: `${
          row.getCanExpand()
            ? `calc(${row.depth} * var(--tree-gap))`
            : `calc(${row.depth > 0 && icon ? '24px' : '0px'} + ${row.depth} * var(--tree-gap))`
        }`
      }}
      title={title}
    >
      {row.getCanExpand() ? (
        <>
          <Button
            icon={IvyIcons.Chevron}
            className='row-expand-button'
            // eslint-disable-next-line i18next/no-literal-string
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
            data-state={row.getIsExpanded() ? 'expanded' : 'collapsed'}
            {...{ onClick: row.getToggleExpandedHandler() }}
          />
          {icon && <IvyIcon icon={icon} />}
        </>
      ) : isLoaded === false ? (
        // eslint-disable-next-line i18next/no-literal-string
        <Button icon={IvyIcons.Chevron} className='row-expand-button' aria-label='Expand row' onClick={onClick} data-state='collapsed' />
      ) : isUnknown === true ? (
        '⛔'
      ) : (
        <>{icon && <IvyIcon icon={icon} />}</>
      )}
      <span className={additionalInfo ? 'row-expand-label' : ''}>{cell.getValue() as string}</span>
      {additionalInfo && <span className='row-expand-label-info'> : {additionalInfo}</span>}
    </Flex>
  );
}
