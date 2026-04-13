import type { InscriptionContext, InscriptionElementContext, InscriptionType, PID } from '@axonivy/process-editor-inscription-protocol';
import { createContext, use, type ReactNode, type RefObject } from 'react';

type EditorContext = {
  context: InscriptionContext;
  elementContext: InscriptionElementContext;
  editorRef: RefObject<HTMLElement | null>;
  type: InscriptionType;
  navigateTo: (pid: PID) => void;
};

export const DEFAULT_EDITOR_CONTEXT: EditorContext = {
  context: { app: '', pmv: '' },
  elementContext: { app: '', pmv: '', pid: '' },
  editorRef: { current: null },
  type: {
    id: 'Script',
    label: 'Unknown Inscription Editor',
    shortLabel: 'Unknown',
    description: 'This is an Inscription Editor for an unknown element type',
    iconId: 'unknown',
    helpUrl: 'unknown'
  },
  navigateTo: () => {}
};

const EditorContext = createContext<EditorContext>(DEFAULT_EDITOR_CONTEXT);
export const EditorContextProvider = ({ context, children }: { context: EditorContext; children: ReactNode }) => {
  return <EditorContext value={context}>{children}</EditorContext>;
};
export const useEditorContext = (): EditorContext => use(EditorContext);
