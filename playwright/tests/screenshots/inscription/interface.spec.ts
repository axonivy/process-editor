import { test } from '@playwright/test';
import { screenshotInscriptionTab, screenshotSection } from './screenshot-util';

const INTERFACE_PID = {
  DATABASE: '18141E75C9CEDD35-f3',
  WS_CALL: '160DF556A2226E66-f6',
  REST: '159FF3D428E42BB5-f46',
  REST2: '159FF3D428E42BB5-f21',
  REST_JAXRS: '159FF3D428E42BB5-f14',
  REST_POST: '159FF3D428E42BB5-f39',
  REST_POST2: '159FF3D428E42BB5-f9',
  REST_POST3: '159FF3D428E42BB5-f16',
  EMAIL: '180D20366E0D3C6D-f3',
  PROGRAM: '16C70B87DCB65433-f8'
} as const;

test.describe('Database', () => {
  test('Query Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.DATABASE, 'Query', 'database-tab-query.png');
  });
});

test.describe('Web Service Call', () => {
  test('Request Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.WS_CALL, 'Request', 'web-service-call-tab-request.png');
  });

  test('Response Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.WS_CALL, 'Output', 'web-service-call-tab-response.png');
  });
});

test.describe('Rest Client', () => {
  test('Request Tab - GET', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.REST, 'Request', 'rest-client-tab-request-get.png');
  });

  test('Request Tab - Parameters', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST, 'Request', 'Parameters', 'rest-client-tab-request-parameters.png');
  });

  test('Request Tab - Headers', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST, 'Request', 'Headers', 'rest-client-tab-request-headers.png');
  });

  test('Request Tab - Properties', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST2, 'Request', 'Properties', 'rest-client-tab-request-properties.png');
  });

  test('Request Tab - POST', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.REST_POST, 'Request', 'rest-client-tab-request-post.png');
  });

  test('Request Tab - Body Raw', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST_POST, 'Request', 'Body', 'rest-client-tab-request-body-raw.png');
  });

  test('Request Tab - Body Form', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST_POST2, 'Request', 'Body', 'rest-client-tab-request-body-form.png');
  });

  test('Request Tab - Body Entity', async ({ page }) => {
    await screenshotSection(page, INTERFACE_PID.REST_POST3, 'Request', 'Body', 'rest-client-tab-request-body-entity.png');
  });

  test('Request Tab - JAX_RS', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.REST_JAXRS, 'Request', 'rest-client-tab-request-jaxrs.png');
  });

  test('Response Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.REST_POST, 'Output', 'rest-client-tab-response.png');
  });
});

test.describe('Email', () => {
  test('Header Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.EMAIL, 'Header', 'mail-tab-header.png');
  });

  test('Content Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.EMAIL, 'Content', 'mail-tab-content.png');
  });

  test('Attachments Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.EMAIL, 'Attachments', 'mail-tab-attachments.png');
  });
});

test.describe('Program', () => {
  test('Start Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.PROGRAM, 'Java Bean', 'program-interface-tab-start.png');
  });

  test('Configuration Tab', async ({ page }) => {
    await screenshotInscriptionTab(page, INTERFACE_PID.PROGRAM, 'Configuration', 'program-interface-tab-configuration.png');
  });
});
