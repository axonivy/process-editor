import type { VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { describe, expect, test } from 'vitest';
import { MappingTreeData } from './mapping-tree-data';

describe('MappingTreeData', () => {
  const variableInfo: VariableInfo = {
    variables: [
      {
        attribute: 'param.procurementRequest',
        type: 'workflow.humantask.ProcurementRequest',
        simpleType: 'ProcurementRequest',
        description: ''
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

  const endlessParamInfo: VariableInfo = {
    variables: [
      {
        attribute: 'param.Endless',
        type: 'demo.Endless',
        simpleType: 'Endless',
        description: ''
      }
    ],
    types: {
      'demo.Endless': [
        {
          attribute: 'endless',
          type: 'demo.Endless',
          simpleType: 'Endless',
          description: ''
        }
      ]
    }
  };

  const tree: MappingTreeData[] = [
    {
      attribute: 'param.procurementRequest',
      children: [
        { attribute: 'accepted', children: [], value: '', type: 'Boolean', simpleType: 'Boolean', isLoaded: true, description: '' },
        { attribute: 'amount', children: [], value: '', type: 'Number', simpleType: 'Number', isLoaded: true, description: '' },
        {
          attribute: 'requester',
          children: [
            { attribute: 'email', children: [], value: '', type: 'String', simpleType: 'String', isLoaded: true, description: '' }
          ],
          value: '',
          type: 'workflow.humantask.User',
          simpleType: 'User',
          isLoaded: true,
          description: ''
        }
      ],
      value: '',
      type: 'workflow.humantask.ProcurementRequest',
      simpleType: 'ProcurementRequest',
      isLoaded: true,
      description: ''
    }
  ];

  const email_node: MappingTreeData = {
    attribute: 'email',
    children: [],
    isLoaded: true,
    simpleType: 'String',
    type: 'String',
    value: '',
    description: ''
  };

  function mappingTreeMultiRootData(): MappingTreeData[] {
    const multiRoot = structuredClone(tree);
    multiRoot.push({
      attribute: 'dummy',
      children: [],
      isLoaded: true,
      simpleType: 'dummy',
      value: '',
      type: 'dummyType',
      description: ''
    });
    return multiRoot;
  }

  test('of', () => {
    expect(MappingTreeData.of(variableInfo)).toEqual(tree);
  });

  test('of endless', () => {
    const treeData = MappingTreeData.of(endlessParamInfo);
    const endlessNode = {
      attribute: 'endless',
      children: [] as MappingTreeData[],
      isLoaded: false,
      simpleType: 'Endless',
      type: 'demo.Endless',
      value: '',
      description: ''
    };
    const expectTree = [
      {
        attribute: 'param.Endless',
        children: [{ ...endlessNode }],
        isLoaded: true,
        simpleType: 'Endless',
        type: 'demo.Endless',
        value: '',
        description: ''
      }
    ];
    expect(treeData).toEqual(expectTree);

    MappingTreeData.loadChildrenFor(endlessParamInfo, 'demo.Endless', treeData);
    expectTree[0].children[0].isLoaded = true;
    expectTree[0].children[0].children = [{ ...endlessNode }];
    expect(treeData).toEqual(expectTree);

    MappingTreeData.loadChildrenFor(endlessParamInfo, 'demo.Endless', treeData);
    expectTree[0].children[0].children[0].isLoaded = true;
    expectTree[0].children[0].children[0].children = [{ ...endlessNode }];
    expect(treeData).toEqual(expectTree);

    MappingTreeData.loadChildrenFor(endlessParamInfo, 'demo.Endless', treeData);
    expectTree[0].children[0].children[0].children[0].isLoaded = true;
    expectTree[0].children[0].children[0].children[0].children = [{ ...endlessNode }];
    expect(treeData).toEqual(expectTree);
  });

  test('update', () => {
    const resultTree = mappingTreeMultiRootData();
    const tree = structuredClone(resultTree);
    MappingTreeData.update(variableInfo, tree, ['param', 'procurementRequest'], 'in');
    MappingTreeData.update(variableInfo, tree, ['param', 'procurementRequest', 'amount'], '12');
    MappingTreeData.update(variableInfo, tree, ['dummy'], 'dummy');

    expect(tree).not.toEqual(resultTree);
    resultTree[0].value = 'in';
    resultTree[0].children[1].value = '12';
    resultTree[1].value = 'dummy';
    expect(tree).toEqual(resultTree);
  });

  test('update should load lazy node', () => {
    const treeData = MappingTreeData.of(variableInfo);
    MappingTreeData.update(variableInfo, treeData, ['param', 'procurementRequest', 'requester', 'email'], 'luke@skywalker.com');

    const expectTree = structuredClone(tree);
    expectTree[0].children[2].isLoaded = true;
    expectTree[0].children[2].children = [{ ...email_node, value: 'luke@skywalker.com' }];

    expect(treeData).toEqual(expectTree);
  });

  test('update unknown mapping', () => {
    const treeData = MappingTreeData.of(variableInfo);
    MappingTreeData.update(variableInfo, treeData, ['dummy'], 'dummy');
    MappingTreeData.update(variableInfo, treeData, ['param', 'unknown'], 'unknown value');
    MappingTreeData.update(variableInfo, treeData, ['param', 'unknown', 'deep'], 'unknown deep value');

    const expectTree = structuredClone(tree);
    expectTree[1] = { attribute: 'dummy', children: [], value: 'dummy', type: '', simpleType: '', isLoaded: true, description: '' };
    expectTree[2] = {
      attribute: 'param.unknown',
      children: [
        { attribute: 'deep', children: [], value: 'unknown deep value', type: '', simpleType: '', isLoaded: true, description: '' }
      ],
      value: 'unknown value',
      type: '',
      simpleType: '',
      isLoaded: true,
      description: ''
    };

    expect(treeData).toEqual(expectTree);
  });

  test('update with single param', () => {
    const variableInfoParam: VariableInfo = {
      variables: [
        {
          attribute: 'param',
          type: 'ch.User',
          simpleType: 'User',
          description: ''
        }
      ],
      types: {
        'ch.User': [
          {
            attribute: 'name',
            type: 'java.String',
            simpleType: 'String',
            description: ''
          }
        ]
      }
    };
    const tree = MappingTreeData.of(variableInfoParam);
    MappingTreeData.update(variableInfo, tree, ['param', 'name'], 'Hans');
    const expectedTree = structuredClone(tree);
    expectedTree[0].children[0].value = 'Hans';
    expect(tree).toHaveLength(1);
    expect(tree).toEqual(expectedTree);
  });

  test('update deep', () => {
    const resultTree = mappingTreeMultiRootData();
    let tree = structuredClone(resultTree);
    tree = MappingTreeData.updateDeep(tree, [0], 'value', 'root');
    tree = MappingTreeData.updateDeep(tree, [0, 1], 'value', '12');
    tree = MappingTreeData.updateDeep(tree, [1], 'value', 'dummy');

    expect(tree).not.toEqual(resultTree);
    resultTree[0].value = 'root';
    resultTree[0].children[1].value = '12';
    resultTree[1].value = 'dummy';
    expect(tree).toEqual(resultTree);
  });

  test('to', () => {
    const tree = mappingTreeMultiRootData();
    expect(MappingTreeData.to(tree)).toEqual({});

    tree[0].value = 'root';
    tree[0].children[1].value = '12';
    tree[1].value = 'dummy';
    const mapping = MappingTreeData.to(tree);
    expect(mapping).toEqual({ 'param.procurementRequest': 'root', 'param.procurementRequest.amount': '12', dummy: 'dummy' });
  });
});
