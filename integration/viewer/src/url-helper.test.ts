import { expect, test } from 'vitest';
import { params } from './url-helper';

test('default', () => {
  expect(
    params(
      new URL(
        'http://localhost:3001/?server=localhost:8081&mode=viewer&app=designer&pmv=workflow-demos&file=/processes/Humantask/ProcurementRequestParallel.p.json'
      )
    )
  ).toEqual({
    app: 'designer',
    highlight: '',
    pid: '',
    pmv: 'workflow-demos',
    previewMode: false,
    select: null,
    sourceUri: '/processes/Humantask/ProcurementRequestParallel.p.json',
    theme: undefined,
    webSocketUrl: 'ws://localhost:8081/designer/1',
    zoom: ''
  });
});

test('demo', () => {
  expect(
    params(
      new URL(
        'https://dev.demo.ivyteam.io/demo-app-10/1/process-viewer/?app=demo-app-10&mode=viewer&highlight=15255056043EE914-f0&pmv=workflow-demos&pid=15255056043EE914&theme=light'
      )
    )
  ).toEqual({
    app: 'demo-app-10',
    highlight: '15255056043EE914-f0',
    pid: '15255056043EE914',
    pmv: 'workflow-demos',
    previewMode: false,
    select: null,
    sourceUri: '',
    theme: 'light',
    webSocketUrl: 'wss://dev.demo.ivyteam.io/demo-app-10/1',
    zoom: ''
  });
});

test('security context', () => {
  expect(
    params(
      new URL(
        'https://dev.demo.ivyteam.io/sec/demo-app-10/1/process-viewer/?app=demo-app-10&mode=viewer&highlight=15255056043EE914-f0&pmv=workflow-demos&pid=15255056043EE914&theme=light'
      )
    )
  ).toEqual({
    app: 'demo-app-10',
    highlight: '15255056043EE914-f0',
    pid: '15255056043EE914',
    pmv: 'workflow-demos',
    previewMode: false,
    select: null,
    sourceUri: '',
    theme: 'light',
    webSocketUrl: 'wss://dev.demo.ivyteam.io/sec/demo-app-10/1',
    zoom: ''
  });
});

test('portal', () => {
  expect(
    params(
      new URL(
        'http://portal01.server.ivy-cloud.com:8080/portal/1/process-viewer/?app=portal&mode=viewer&highlight=15255056043EE914-f0&pmv=internalSupport&pid=15255056043EE914&theme=light'
      )
    )
  ).toEqual({
    app: 'portal',
    highlight: '15255056043EE914-f0',
    pid: '15255056043EE914',
    pmv: 'internalSupport',
    previewMode: false,
    select: null,
    sourceUri: '',
    theme: 'light',
    webSocketUrl: 'ws://portal01.server.ivy-cloud.com:8080/portal/1',
    zoom: ''
  });
});
