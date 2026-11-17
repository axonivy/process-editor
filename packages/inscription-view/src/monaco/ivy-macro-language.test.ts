import { describe, expect, test } from 'vitest';
import { createIvyMacroLanguage } from './ivy-macro-language';
import { createIvyScriptLanguage } from './ivy-script-language';

describe('IvyMacroLanguage tokenizer', () => {
  test('uses the IvyScript tokenizer only inside interpolation tags', async () => {
    const { language: javaLanguage } = await import('monaco-editor/languages/definitions/java/java');
    const ivyScriptLanguage = createIvyScriptLanguage(javaLanguage);
    const ivyMacroLanguage = createIvyMacroLanguage(ivyScriptLanguage);
    const tokenizer = ivyMacroLanguage.tokenizer;

    expect(tokenizer.root).toEqual([[/[^<]+/, ''], [/<%=/, 'tag', '@ivyExpression'], [/</, '']]);
    expect(tokenizer.ivyExpression).toEqual([[/%>/, 'tag', '@pop'], { include: '@ivyScriptRoot' }]);
    expect(tokenizer.ivyScriptRoot).toEqual(ivyScriptLanguage.tokenizer.root);
  });
});
