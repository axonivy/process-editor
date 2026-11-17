import { describe, expect, test } from 'vitest';
import { IvyMonacoTheme } from './ivy-monaco-theme';

describe('IvyMonacoTheme', () => {
  test.each([
    ['dark', '4EC9B0', 'DCDCAA', '9CDCFE'],
    ['light', '267F99', '795E26', '001080']
  ] as const)('maps Java-compatible Ivy Script scopes for the %s theme', (theme, typeColor, functionColor, variableColor) => {
    const rules = IvyMonacoTheme.themeData(theme).rules;

    expect(rules).toContainEqual({ token: 'entity.name.type.java', foreground: typeColor });
    expect(rules).toContainEqual({ token: 'entity.name.function.java', foreground: functionColor });
    expect(rules).toContainEqual({ token: 'variable.other.object.java', foreground: variableColor });
  });
});
