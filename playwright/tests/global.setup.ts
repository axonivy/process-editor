export const server = process.env.BASE_URL ?? 'http://localhost:8080/';

const setup = async () => {
  if (!process.env.BASE_URL) {
    return;
  }
  const response = await fetch(`${server}api/web-ide/workspaces`, {
    method: 'GET',
    headers: {
      'X-Requested-By': 'e2e-tests',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('Developer:Developer').toString('base64')
    }
  });
  if (!response.ok) {
    console.log(`Failed to get workspaces: ${response.status} ${response.statusText}`);
  }
};

setup();

export default setup;
