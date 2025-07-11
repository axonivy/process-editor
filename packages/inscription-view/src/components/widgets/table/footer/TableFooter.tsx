import { Button, TableHead, TableRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const TableShowMore = ({ colSpan, showMore, helpertext }: { colSpan: number; showMore: () => void; helpertext: string }) => {
  return (
    <TableRow>
      <TableHead colSpan={colSpan} className='show-more-rows'>
        <Button icon={IvyIcons.Dots} onClick={showMore} aria-label={helpertext}>
          {helpertext}
        </Button>
      </TableHead>
    </TableRow>
  );
};
