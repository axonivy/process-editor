/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import type { ActionMessage, ContainerConfiguration, IDiagramOptions } from '@eclipse-glsp/client';
import {
  BaseJsonrpcGLSPClient,
  Disposable,
  Emitter,
  baseViewModule,
  contextMenuModule,
  createDiagramOptionsModule,
  defaultModule,
  gridModule,
  initializeContainer,
  initializeDiagramContainer
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import type { Event, MessageConnection, NotificationHandler, ProgressType } from 'vscode-jsonrpc';
import ivyDiagramModule from '../diagram/di.config';

export class StubMessageConnection implements MessageConnection {
  private mockEvent: Event<any> = (listener: (e: any) => any, thisArgs?: any, disposables?: Disposable[]): Disposable =>
    Disposable.create(() => {});

  sendRequest(...args: unknown[]): any {
    throw new Error('Method not implemented.');
  }

  onRequest(...args: unknown[]): Disposable {
    return Disposable.create(() => {});
  }
  hasPendingResponse(): boolean {
    return false;
  }
  sendNotification(...args: unknown[]): Promise<void> {
    return Promise.resolve();
  }

  onNotification(...args: unknown[]): Disposable {
    return Disposable.create(() => {});
  }

  onProgress<P>(type: ProgressType<P>, token: string | number, handler: NotificationHandler<P>): Disposable {
    throw new Error('Method not implemented.');
  }
  sendProgress<P>(type: ProgressType<P>, token: string | number, value: P): Promise<void> {
    throw new Error('Method not implemented.');
  }
  onUnhandledProgress = this.mockEvent;

  trace(...args: unknown[]): Promise<void> {
    return Promise.resolve();
  }
  onError = this.mockEvent;
  onClose = this.mockEvent;
  listen(): void {}
  onUnhandledNotification = this.mockEvent;
  end(): void {}
  onDispose = this.mockEvent;
  dispose(): void {}
  inspect(): void {}
}

export class TestJsonRpcClient extends BaseJsonrpcGLSPClient {
  protected override onActionMessageNotificationEmitter = new Emitter<ActionMessage>({
    onFirstListenerAdd: () => (this.firstListenerAdded = true),
    onLastListenerRemove: () => (this.lastListenerRemoved = true)
  });

  firstListenerAdded: boolean;
  lastListenerRemoved: boolean;
}

export function createTestDiagramOptions(options?: IDiagramOptions): IDiagramOptions {
  const connection = new StubMessageConnection();
  const client = new TestJsonRpcClient({ id: 'ivy-glsp-process', connectionProvider: connection });
  return {
    clientId: 'sprotty',
    diagramType: 'ivy-glsp-process',
    glspClientProvider: async () => client,
    ...options
  };
}

export function createTestContainer(...containerConfigurations: ContainerConfiguration): Container {
  return initializeContainer(
    new Container(),
    defaultModule,
    createDiagramOptionsModule(createTestDiagramOptions()),
    ...containerConfigurations
  );
}

export function createTestDiagramContainer(...containerConfigurations: ContainerConfiguration): Container {
  return initializeDiagramContainer(
    new Container(),
    createDiagramOptionsModule(createTestDiagramOptions()),
    gridModule,
    baseViewModule,
    ivyDiagramModule,
    { remove: contextMenuModule },
    ...containerConfigurations
  );
}
