#!/bin/bash
set -e

mvn --batch-mode -f integration/viewer/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/process-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/inscription-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}

pnpm install
pnpm run raise:version ${1/SNAPSHOT/next}
pnpm install --no-frozen-lockfile
