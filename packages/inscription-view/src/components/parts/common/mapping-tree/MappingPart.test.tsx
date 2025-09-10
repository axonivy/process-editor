import type { VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import MappingPart from './MappingPart';

describe('MappingPart', () => {
  const ATTRIBUTES = /Attribute/;
  const PARAMS = /param.procurementRequest/;
  const NODE_PARAMS = /param.procurementRequest/;
  const NODE_BOOLEAN = /accepted/;
  const NODE_NUMBER = /amount/;
  const USER = /requester/;
  const NODE_STRING = /email/;

  const variableInfo: VariableInfo = {
    variables: [
      {
        attribute: 'param.procurementRequest',
        type: 'workflow.humantask.ProcurementRequest',
        simpleType: 'ProcurementRequest',
        description: 'this is a description'
      }
    ],
    types: {
      'workflow.humantask.ProcurementRequest': [
        {
          attribute: 'accepted',
          type: 'Boolean',
          simpleType: 'Boolean',
          description: ''
        },
        {
          attribute: 'amount',
          type: 'Number',
          simpleType: 'Number',
          description: ''
        },
        {
          attribute: 'requester',
          type: 'workflow.humantask.User',
          simpleType: 'User',
          description: ''
        }
      ],
      'workflow.humantask.User': [
        {
          attribute: 'email',
          type: 'String',
          simpleType: 'String',
          description: ''
        }
      ]
    }
  };

  function renderTree(initData?: Record<string, string>): {
    data: () => Record<string, string>;
  } {
    userEvent.setup();
    let data = initData ?? { 'param.procurementRequest': 'in' };
    customRender(
      <MappingPart
        browsers={['attr', 'func', 'type']}
        data={data}
        defaultData={initData ?? { 'param.procurementRequest': 'in' }}
        variableInfo={variableInfo}
        onChange={(change: Record<string, string>) => (data = change)}
        defaultOpen={true}
      />
    );
    return {
      data: () => data
    };
  }

  function assertTableHeaders(expectedHeaders: string[]) {
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(expectedHeaders.length);
    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]!);
    });
  }

  function assertTableRows(expectedRows: (RegExp | string)[]) {
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(expectedRows.length);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(expectedRows[index]!);
    });
  }

  test('tree will render', () => {
    renderTree();
    assertTableHeaders(['Attribute', 'Expression']);
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER]);
  });

  test('tree will render unknown values', () => {
    renderTree({ bla: 'unknown value' });
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER, /⛔bla/]);
  });

  test('tree will render all inscribed values', () => {
    renderTree({ 'param.procurementRequest.requester.email': 'louis' });
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER, NODE_STRING]);
  });

  test('tree will render description title', () => {
    renderTree({ 'workflow.humantask.Description': 'value' });
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('param.procurementRequest');
    expect(screen.getAllByRole('row')[1]).toHaveAccessibleName('param.procurementRequest');
  });

  test('tree can expand / collapse', async () => {
    renderTree();
    const treeExpander = screen.getByRole('button', { name: 'Expand tree' });
    await userEvent.click(treeExpander);
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER, NODE_STRING]);

    await userEvent.click(treeExpander);
    assertTableRows([ATTRIBUTES, PARAMS]);
  });

  test('tree row can expand / collapse', async () => {
    renderTree();
    const rowExpander = screen.getByRole('button', { name: 'Expand row' });
    await userEvent.click(rowExpander);
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER, NODE_STRING]);
    await userEvent.click(rowExpander);
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER]);
  });

  test('tree will filter', async () => {
    renderTree();
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    const toggleFilter = screen.getByRole('button', { name: 'Search' });
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER]);

    await userEvent.click(toggleFilter);
    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toHaveValue('');

    await userEvent.type(searchInput, 'ail');
    assertTableRows([ATTRIBUTES, PARAMS, USER, NODE_STRING]);

    await userEvent.click(toggleFilter);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER, NODE_STRING]);

    await userEvent.click(toggleFilter);
    expect(screen.getByPlaceholderText('Search')).toHaveValue('');
  });

  test('tree will show only inscribed values', async () => {
    renderTree();
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    const toggleInscribed = screen.getByRole('button', { name: 'Mapped' });
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER]);

    await userEvent.click(toggleInscribed);
    assertTableRows([ATTRIBUTES, NODE_PARAMS]);

    await userEvent.click(toggleInscribed);
    assertTableRows([ATTRIBUTES, PARAMS, NODE_BOOLEAN, NODE_NUMBER, USER]);
  });

  test('tree support readonly mode', async () => {
    customRender(
      <MappingPart
        browsers={['attr', 'func', 'type']}
        data={{ bla: 'unknown value' }}
        defaultData={{ bla: 'unknown value' }}
        variableInfo={variableInfo}
        defaultOpen={true}
        onChange={() => {}}
      />,
      {
        wrapperProps: { editor: { readonly: true } }
      }
    );
    expect(screen.getAllByRole('textbox')[0]).toBeDisabled();
  });
});
