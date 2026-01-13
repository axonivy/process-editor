import { rm } from 'node:fs';

const teardown = () => {
  console.log('Global teardown: Cleaning up test projects');
  rm('./process-test-project/processes/test', { force: true, recursive: true }, () => {});
  rm('./process-test-project/dataclasses/test', { force: true, recursive: true }, () => {});
  rm('./inscription-test-project/processes/test', { force: true, recursive: true }, () => {});
  rm('./inscription-test-project/dataclasses/test', { force: true, recursive: true }, () => {});
  console.log('Global teardown: Cleanup done');
};

teardown();

export default teardown;
