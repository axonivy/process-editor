import type { RestMultiValuedMap, RestParameter } from '@axonivy/process-editor-inscription-protocol';

export type RestParam = {
  name: string;
  expression: string;
  known: boolean;
  doc?: string;
  type?: string;
};

export function restParamBuilder() {
  let params: RestParam[] = [];
  const builder = {
    openApiParam(parameter?: RestParameter) {
      params =
        parameter?.properties?.map<RestParam>(param => ({
          name: param.name,
          expression: '',
          known: true,
          doc: `${param.required ? '* required\n' : ''}${param.doc}`,
          type: param.type.fullQualifiedName
        })) ?? [];
      return builder;
    },
    restMap(map: RestMultiValuedMap) {
      Object.entries(map).forEach(([key, values]) => {
        values.forEach(value => {
          const foundParam = params.find(p => p.name === key);
          if (foundParam) {
            if (foundParam.expression === '') {
              foundParam.expression = value;
            } else {
              const index = params.indexOf(foundParam);
              const newParam = structuredClone(foundParam);
              newParam.expression = value;
              params.splice(index + 1, 0, newParam);
            }
          } else {
            params.push({ name: key, expression: value, known: false });
          }
        });
      });
      return builder;
    },
    build() {
      return params;
    }
  };
  return builder;
}

export function updateRestParams(params: RestParam[], rowIndex: number, columnId: string, value: string): RestParam[] {
  return params.map((row, index) => {
    if (index === rowIndex) {
      return {
        ...row,
        [columnId]: value
      };
    }
    return row;
  });
}

export function toRestMap(params: RestParam[]): RestMultiValuedMap {
  const mappings: RestMultiValuedMap = {};
  params.forEach(p => {
    const values = mappings[p.name];
    mappings[p.name] = values ? [...values, p.expression] : [p.expression];
  });
  return mappings;
}
