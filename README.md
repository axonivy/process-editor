# Axon Ivy Process Editor Client

This repository contains the Axon Ivy (GLSP-based) process editor.

## Prerequisites

The following libraries/frameworks need to be installed on your system:

- [Node.js](https://nodejs.org/en/) `>= 20.10.0`

The editor is developed using [Visual Studio Code](https://code.visualstudio.com/).
However, it's of course also possible to use another text editor.

---

## Structure

- `editor`: GLSP-based Axon Ivy process editor
- `integration/eclipse`: Eclipse IDE integration of the process editor
- `integration/standalone`: Standalone integration of the process editor

---

## Building the process editor

The process editor component has to be built using pnpm.

```bash
#install node modules
pnpm install

#build typescript
pnpm run build

#build integrations
pnpm run package
```

## Running the process editor

The simplest way to start the process editor is by download a [Axon Ivy Designer](https://developer.axonivy.com/download/nightly) and open a process. This will launch the latest prebuild **process editor within the eclipse integration**.

- **Standalone / Eclipse Integration**:
  To start the Standalone or Eclipse integration you can start the specific launch config directly inside the VS Code.

---

## More information

For more information about GLSP, please visit the [Eclipse GLSP Umbrella repository](https://github.com/eclipse-glsp/glsp) and the [Eclipse GLSP Website](https://www.eclipse.org/glsp/).
