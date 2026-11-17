import { withJavaSyntaxHighlighting } from './java-language';
import { MonacoLanguageUtil } from './monaco-language-util';
import type { MonacoApi, monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export namespace IvyScriptLanguage {
  export const Language: monaco.languages.ILanguageExtensionPoint = {
    id: 'ivyScript',
    extensions: ['.ivyScript', '.ivyScript'],
    aliases: ['IvyScript', 'ivyScript']
  };

  export async function isInstalled(monaco?: MonacoApi): Promise<boolean> {
    return MonacoLanguageUtil.isInstalled(Language.id, monaco);
  }

  export async function install(monacoApi?: MonacoApi): Promise<void> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    if (await isInstalled(monaco)) {
      return;
    }
    monaco.languages.register(Language);
    const { language: javaLanguage } = await import('monaco-editor/languages/definitions/java/java');
    monaco.languages.setLanguageConfiguration(Language.id, ivyScriptConf);
    monaco.languages.setMonarchTokensProvider(Language.id, createIvyScriptLanguage(javaLanguage));
    monaco.languages.registerFoldingRangeProvider(Language.id, {
      provideFoldingRanges(model) {
        const ranges = [...braceRanges(model), ...markerRanges(model, monaco)];
        const imports = importSectionRange(model, monaco);
        if (imports) {
          ranges.push(imports);
        }
        return ranges;
      }
    });
  }
}

const importSectionRange = (model: monaco.editor.ITextModel, monacoApi: MonacoApi): monaco.languages.FoldingRange | null => {
  const lineCount = model.getLineCount();
  let importStart = -1;
  let importEnd = -1;

  for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
    const lineContent = model.getLineContent(lineNumber).trim();
    if (lineContent.startsWith('import ')) {
      if (importStart === -1) {
        importStart = lineNumber;
      }
      importEnd = lineNumber;
      continue;
    }
    if (lineContent.length === 0 && importStart !== -1) {
      continue;
    }
    break;
  }

  if (importStart === -1 || importEnd <= importStart) {
    return null;
  }

  return { start: importStart, end: importEnd, kind: monacoApi.languages.FoldingRangeKind.Imports };
};

const braceRanges = (model: monaco.editor.ITextModel): monaco.languages.FoldingRange[] => {
  const ranges: monaco.languages.FoldingRange[] = [];
  const stack: number[] = [];
  let inBlockComment = false;
  let inString = false;
  let inChar = false;
  let escapeNext = false;

  for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
    const lineContent = model.getLineContent(lineNumber);
    let inLineComment = false;

    for (let index = 0; index < lineContent.length; index++) {
      const char = lineContent[index];
      const nextChar = lineContent[index + 1];

      if (inLineComment) {
        break;
      }

      if (inBlockComment) {
        if (char === '*' && nextChar === '/') {
          inBlockComment = false;
          index++;
        }
        continue;
      }

      if (inString) {
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        if (char === '"') {
          inString = false;
        }
        continue;
      }

      if (inChar) {
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        if (char === "'") {
          inChar = false;
        }
        continue;
      }

      if (char === '/' && nextChar === '/') {
        inLineComment = true;
        continue;
      }

      if (char === '/' && nextChar === '*') {
        inBlockComment = true;
        index++;
        continue;
      }

      if (char === '"') {
        inString = true;
        continue;
      }

      if (char === "'") {
        inChar = true;
        continue;
      }

      if (char === '{') {
        stack.push(lineNumber);
      }
      if (char === '}') {
        const start = stack.pop();
        if (start !== undefined && lineNumber > start) {
          ranges.push({ start, end: lineNumber });
        }
      }
    }
  }

  return ranges;
};

const markerRanges = (model: monaco.editor.ITextModel, monacoApi: MonacoApi): monaco.languages.FoldingRange[] => {
  const ranges: monaco.languages.FoldingRange[] = [];
  const stack: number[] = [];
  const startMarker = ivyScriptConf.folding?.markers?.start;
  const endMarker = ivyScriptConf.folding?.markers?.end;

  if (!startMarker || !endMarker) {
    return ranges;
  }

  for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
    const lineContent = model.getLineContent(lineNumber);
    if (startMarker.test(lineContent)) {
      stack.push(lineNumber);
      continue;
    }
    if (endMarker.test(lineContent)) {
      const start = stack.pop();
      if (start !== undefined && lineNumber > start) {
        ranges.push({ start, end: lineNumber, kind: monacoApi.languages.FoldingRangeKind.Region });
      }
    }
  }

  return ranges;
};

const IVY_SCRIPT_KEYWORDS = ['IF', 'is', 'initialized', 'as', 'null'];
const IVY_SCRIPT_OPERATORS = ['<>', '**', '**='];

export const createIvyScriptLanguage = (javaLanguage: monaco.languages.IMonarchLanguage): monaco.languages.IMonarchLanguage =>
  withJavaSyntaxHighlighting({
    ...javaLanguage,
    tokenPostfix: '.ivyscript',
    keywords: [...new Set([...(javaLanguage.keywords ?? []), ...IVY_SCRIPT_KEYWORDS])],
    operators: [...new Set([...(javaLanguage.operators ?? []), ...IVY_SCRIPT_OPERATORS])]
  });

export const ivyScriptConf: monaco.languages.LanguageConfiguration = {
  wordPattern: /(-?\d*\.\d\w*)|([^`~!#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '<', close: '>' }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))'),
      end: new RegExp('^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))')
    }
  }
};
