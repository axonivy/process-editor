import { Flex, SearchInput, Table } from '@axonivy/ui-components';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import './Table.css';

type TableProps = ComponentProps<typeof Table> & {
  search?: { value: string; onChange: (value: string) => void };
};

export const SearchTable = ({ search, ...props }: TableProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={1}>
      {search && <SearchInput placeholder={t('common.label.search')} {...search} />}
      <Table {...props} />
    </Flex>
  );
};
