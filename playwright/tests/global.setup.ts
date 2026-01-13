import { user } from './create-random-process';

export const server = process.env.BASE_URL ?? 'localhost:8080/';

const setup = async () => {
  if (!process.env.BASE_URL) {
    return;
  }
  await fetch(`${server}api/web-ide/workspaces`, {
    method: 'GET',
    headers: {
      'X-Requested-By': 'e2e-tests',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
    }
  });
};

setup();

export default setup;
