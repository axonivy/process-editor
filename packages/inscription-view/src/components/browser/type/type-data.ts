import type { DataclassType, JavaType } from '@axonivy/process-editor-inscription-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useTypeData = (
  dataClasses: DataclassType[],
  ivyTypes: JavaType[],
  ownTypes: JavaType[],
  allTypes: JavaType[],
  allTypesSearchActive: boolean
) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const nonIvyTypes = ivyTypes.filter(type => !isIvyType(type.fullQualifiedName));
    const ivyOnlyTypes = ivyTypes.filter(type => isIvyType(type.fullQualifiedName));
    const excludedFullQualifiedNames = new Set([
      ...dataClasses.map(dc => dc.fullQualifiedName),
      ...ivyTypes.map(type => type.fullQualifiedName)
    ]);

    const filteredAllTypes = allTypes.filter(type => !excludedFullQualifiedNames.has(type.fullQualifiedName));
    const filteredOwnTypes = ownTypes.filter(type => !excludedFullQualifiedNames.has(type.fullQualifiedName));

    const sortedDataClasses = dataClasses.sort((a, b) => a.name.localeCompare(b.name));
    const sortedNonIvyTypes = nonIvyTypes.sort((a, b) => a.simpleName.localeCompare(b.simpleName));
    const sortedIvyOnlyTypes = ivyOnlyTypes.sort((a, b) => a.simpleName.localeCompare(b.simpleName));

    const dataClassNodes = sortedDataClasses.map(dataClass =>
      createNode({ ...dataClass, simpleName: dataClass.name }, IvyIcons.LetterD, dataClass)
    );
    const nonIvyTypeNodes = sortedNonIvyTypes.map(javaType => createNode(javaType, IvyIcons.Ivy));
    const ivyTypeNodes = sortedIvyOnlyTypes.map(javaType => createNode(javaType, IvyIcons.Ivy));
    const ownTypeNodes = filteredOwnTypes.map(javaType => createNode(javaType, IvyIcons.DataClass));
    const allTypeNodes = filteredAllTypes.map(type => {
      const icon = dataClasses.find(dc => dc.fullQualifiedName === type.fullQualifiedName)
        ? IvyIcons.LetterD
        : type.fullQualifiedName.includes('ivy')
          ? IvyIcons.Ivy
          : IvyIcons.DataClass;
      return createNode(type, icon);
    });
    const combinedTypes = allTypesSearchActive
      ? [...dataClassNodes, ...nonIvyTypeNodes, ...ivyTypeNodes, ...allTypeNodes]
      : [
          {
            value: t('browser.dataClasses'),
            info: '',
            icon: IvyIcons.LetterD,
            data: undefined,
            notSelectable: true,
            children: dataClassNodes,
            isLoaded: true
          },
          {
            value: t('browser.ivyScriptTypes'),
            info: '',
            icon: IvyIcons.Ivy,
            data: undefined,
            notSelectable: true,
            children: [...nonIvyTypeNodes, ...ivyTypeNodes],
            isLoaded: true
          },
          ...(ownTypeNodes.length > 0
            ? [
                {
                  value: t('browser.ownTypes'),
                  info: '',
                  icon: IvyIcons.DataClass,
                  data: undefined,
                  notSelectable: true,
                  children: ownTypeNodes,
                  isLoaded: true
                }
              ]
            : [])
        ];

    const sortedCombinedTypes =
      allTypesSearchActive && (filteredAllTypes.length > 0 || filteredOwnTypes.length > 0)
        ? combinedTypes.sort((a, b) => {
            const infoComparison = a.value.localeCompare(b.value);
            return infoComparison !== 0 ? infoComparison : a.info.localeCompare(b.info);
          })
        : combinedTypes;

    return sortedCombinedTypes;
  }, [dataClasses, ivyTypes, ownTypes, allTypes, allTypesSearchActive, t]);
};

const createNode = (javaType: JavaType, icon: IvyIcons, data?: DataclassType): BrowserNode<DataclassType> => ({
  value: javaType.simpleName,
  info: javaType.packageName,
  icon,
  data: data ? data : { ...javaType, name: javaType.simpleName, path: '' },
  children: [],
  isLoaded: true
});

const isIvyType = (fullQualifiedName: string) => {
  return fullQualifiedName.includes('ivy');
};
