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
    monaco.languages.setLanguageConfiguration(Language.id, ivyScriptConf);
    monaco.languages.setMonarchTokensProvider(Language.id, ivyScriptLang);
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

export const ivyScriptLang: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.ivyscript',
  keywords: [
    'continue',
    'for',
    'new',
    'boolean',
    'if',
    'IF',
    'break',
    'double',
    'byte',
    'else',
    'import',
    'instanceof',
    'catch',
    'int',
    'short',
    'try',
    'char',
    'finally',
    'long',
    'float',
    'while',
    'true',
    'false',
    'is',
    'initialized',
    'as'
  ],
  operators: [
    '=',
    '>',
    '<',
    '!',
    '?',
    ':',
    '==',
    '<=',
    '>=',
    '!=',
    '<>',
    '&&',
    '||',
    '++',
    '--',
    '+',
    '-',
    '*',
    '/',
    '&',
    '|',
    '^',
    '%',
    '**',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '**='
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  tokenizer: {
    root: [
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            '@keywords': { token: 'keyword.$0' },
            '@default': 'identifier'
          }
        }
      ],
      { include: '@whitespace' },
      [/[{}()[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': ''
          }
        }
      ],
      [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
      [/0(@octaldigits)[Ll]?/, 'number.octal'],
      [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
      [/(@digits)[fFdD]/, 'number.float'],
      [/(@digits)[lL]?/, 'number'],
      [/[;,.]/, 'delimiter'],
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],
    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ]
  }
};

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
