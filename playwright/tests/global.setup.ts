import type { FullConfig } from '@playwright/test';
import path from 'node:path';

const user = 'Developer';
const inscriptionProject = 'inscription-test-project';
const projects = ['process-test-project', inscriptionProject];
const requestHeaders = {
  'X-Requested-By': 'process-editor-tests',
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${user}:${user}`).toString('base64')}`
};

const apiUrl = (engineUrl: string, resource: string) => `${engineUrl.replace(/\/?$/, '/')}designer/api/web-ide/${resource}`;

const setupProject = async (engineUrl: string, projectName: string, workspacePath: string) => {
  const workspaceResponse = await fetch(apiUrl(engineUrl, 'workspace'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ name: projectName, path: workspacePath })
  });
  if (!workspaceResponse.ok) {
    throw new Error(`Failed to create workspace '${projectName}': ${workspaceResponse.status} ${await workspaceResponse.text()}`);
  }
  const workspace: unknown = await workspaceResponse.json();
  if (typeof workspace !== 'object' || workspace === null || !('id' in workspace) || typeof workspace.id !== 'string') {
    throw new Error(`Workspace creation returned an invalid response for '${projectName}'`);
  }

  const projectPath = path.join(workspacePath, projectName);
  const projectResponse = await fetch(apiUrl(engineUrl, 'project'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ workspaceId: workspace.id, name: projectName, path: projectPath })
  });
  if (!projectResponse.ok) {
    throw new Error(`Failed to find or create project '${projectName}': ${projectResponse.status} ${await projectResponse.text()}`);
  }

  const deployResponse = await fetch(apiUrl(engineUrl, 'projects/deployProjects'), {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({ workspaceId: workspace.id, projectDirs: [projectPath] })
  });
  if (!deployResponse.ok) {
    throw new Error(`Failed to deploy project '${projectName}': ${deployResponse.status} ${await deployResponse.text()}`);
  }
};

const setup = async (config: FullConfig) => {
  const engineUrl = process.env.BASE_URL ?? 'http://localhost:8080';
  const workspacePath = path.resolve(import.meta.dirname, '..');
  try {
    await Promise.all(projects.map(project => setupProject(engineUrl, project, workspacePath)));
    await activateInscriptionApp(config, engineUrl);
  } catch (error) {
    if (process.env.CI) {
      throw new Error(`Failed to set up projects: ${error}`, { cause: error });
    }
    console.error('Error setting up projects:', error);
  }
};

const activateInscriptionApp = async (config: FullConfig, engineUrl: string) => {
  const playwrightProjects = config.filteredProjects.map(project => project.name);
  if (playwrightProjects.includes('screenshots-inscription')) {
    const result = await fetch(engineUrl + `/~${user}-${inscriptionProject}`);
    if (!result.ok) {
      throw new Error(`Failed to activate inscription app: ${result.status} ${await result.text()}`);
    }
  }
};

export default setup;
