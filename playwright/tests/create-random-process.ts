import { randomUUID } from 'crypto';

export type ProcessKind = 'Business Process' | 'Web Service Process' | 'Callable Sub Process' | 'Html Dialog Logic';
export const user = 'Developer';

export const createRandomProcess = async (
  baseUrl: string,
  app: string,
  pmv: string,
  kind: ProcessKind = 'Business Process'
): Promise<string> => {
  const name = `random${randomUUID().replaceAll('-', '')}`;
  const createProcessApiUrl = baseUrl + '/api/web-ide/process';
  const response = await fetch(createProcessApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64'),
      'X-Requested-By': 'e2e-tests'
    },
    body: JSON.stringify({ name, namespace: 'test', kind, project: { app, pmv } })
  });
  if (!response.ok) {
    throw new Error(`${response.status} Failed to create process file (url: ${createProcessApiUrl}): ${response.statusText}`);
  }
  return `processes/test/${name}.p.json`;
};

export type ProcessBean = {
  name: string;
  namespace: string;
  processIdentifier: { pid: string };
};

export const server = process.env.BASE_URL
  ? `${process.env.BASE_URL}${process.env.TEST_WS}`
  : 'http://localhost:8080/~Developer-inscription-test-project';
const app = process.env.TEST_APP ?? 'Developer-inscription-test-project';
const pmv = 'inscription-test-project';

export const copyInscriptionProcess = async (pid: string) => copyProcess(server, app, pmv, pid);

export const copyProcess = async (baseUrl: string, app: string, pmv: string, pid: string) => {
  const name = `random${randomUUID().replaceAll('-', '')}`;
  const copyProcessApiUrl = baseUrl + '/api/web-ide/process/copy';
  const response = await fetch(copyProcessApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64'),
      'X-Requested-By': 'e2e-tests'
    },
    body: JSON.stringify({ name, namespace: 'test', source: { pid, project: { app, pmv } } })
  });
  if (!response.ok) {
    throw new Error(`${response.status} Failed to copy process file (url: ${copyProcessApiUrl}): ${response.statusText}`);
  }
  return (await response.json()) as ProcessBean;
};

export const deleteInscriptionProcess = async (pid: string) => deleteProcess(server, app, pmv, pid);

export const deleteProcess = async (baseUrl: string, app: string, pmv: string, pid: string) => {
  const deleteProcessApiUrl = baseUrl + '/api/web-ide/process';
  const response = await fetch(deleteProcessApiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64'),
      'X-Requested-By': 'e2e-tests'
    },
    body: JSON.stringify({ pid, project: { app, pmv } })
  });
  if (!response.ok) {
    throw new Error(`${response.status} Failed to delete process file (url: ${deleteProcessApiUrl}): ${response.statusText}`);
  }
};
