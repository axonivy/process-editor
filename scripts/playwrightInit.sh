
#!/bin/bash
TEST_PROJECTS=("process-test-project" "inscription-test-project")

if [ -z "$1" ]; then
  echo "Error: Please provide the path to the core repository as an argument. E.g.: './scripts/playwrightInit.sh /home/ivy/dev/core'"
  exit 1
fi

for TEST_PROJECT_NAME in "${TEST_PROJECTS[@]}"; do
  TEST_PROJECT_DIR="$(pwd)/playwright/$TEST_PROJECT_NAME"
  if [ ! -d "$TEST_PROJECT_DIR" ]; then
    echo "Error: $TEST_PROJECT_NAME was not found at '$TEST_PROJECT_DIR'. Execute the script from the repository root."
    exit 1
  fi

  TARGET_DIR="$1/workspace/ch.ivyteam.ivy.server.file.feature/target/server-root/data/workspaces/Developer/$TEST_PROJECT_NAME"
  mkdir -p "$TARGET_DIR"
  if [ -L "$TARGET_DIR/$TEST_PROJECT_NAME" ]; then
    rm "$TARGET_DIR/$TEST_PROJECT_NAME"
  fi
  ln -s "$(pwd)/playwright/$TEST_PROJECT_NAME" "$TARGET_DIR/$TEST_PROJECT_NAME"
  echo "Linked $TEST_PROJECT_NAME successfully"
done
