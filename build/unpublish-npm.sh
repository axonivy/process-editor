#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/process-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/process-editor-inscription@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/process-editor-inscription-core@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/process-editor-inscription-protocol@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/process-editor-inscription-view@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/process-editor-protocol@${1}" --registry $REGISTRY
