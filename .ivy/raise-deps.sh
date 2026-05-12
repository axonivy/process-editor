#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION="$1"

update_version() {
  local version="${1/SNAPSHOT/next}"
  sed -i -E "s/(\"@axonivy[^\"]*\": \"(workspace:)?)[^\"]*(\")/\1~$version\3/" "$2"
}

for pkg in packages/*/package.json integration/*/package.json package.json; do
  update_version "$VERSION" "$pkg"
done

pnpm run update:axonivy:next

if [ "$DRY_RUN" = false ]; then
  pnpm install --no-frozen-lockfile
fi
