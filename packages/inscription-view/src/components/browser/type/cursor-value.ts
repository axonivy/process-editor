import type { DataclassType } from '@axonivy/process-editor-inscription-protocol';
import type { BrowserNode } from '@axonivy/ui-components';

export const getCursorValue = (value: BrowserNode<DataclassType>, isIvyType: boolean, typeAsList: boolean, inCodeBlock: boolean) => {
  if (isIvyType || inCodeBlock) {
    return typeAsList ? 'List<' + value.value + '>' : value.value;
  } else {
    return typeAsList ? 'List<' + value.data?.fullQualifiedName + '>' : (value.data?.fullQualifiedName ?? '');
  }
};
