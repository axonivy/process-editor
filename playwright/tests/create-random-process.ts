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
