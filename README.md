# Axon Ivy Process Editor Client

This repository contains the Axon Ivy (GLSP-based) process editor.

## Prerequisites

The following libraries/frameworks need to be installed on your system:

- [Node.js](https://nodejs.org/en/) `>= 20.19`

The editor is developed using [Visual Studio Code](https://code.visualstudio.com/).
However, it's of course also possible to use another text editor.

---

## Structure

- `packages/editor`: GLSP-based Axon Ivy process editor
- `packages/inscription`: UI extension for element inscription view
- `packages/protocol`: GLSP actions for process editor
- `integration/eclipse`: Eclipse IDE integrations of the process editor
- `integration/standalone`: Standalone integration of the process editor
- `integration/viewer`: Standalone integration of the process viewer (read-only with less tooling)

---

## Building the process editor

The process editor component has to be built using npm.

```bash
#install node modules
npm install

#build typescript
npm run build

#build integrations (sometimes you need to delete the node_modules folder first because of a missing monaco-editor dependency)
npm run package
```

## Running the process editor

The simplest way to start the process editor is by download a [Axon Ivy Designer](https://developer.axonivy.com/download/nightly) and open a process. This will launch the latest prebuild **process editor within the eclipse integration**.

- **Standalone**:
  To start the Standalone integration you can start the Launch Standalone config directly inside the VS Code.

---

## More information

For more information about GLSP, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
