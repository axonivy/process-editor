import {
  BaseRpcClient,
  createMessageConnection,
  Emitter,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  Event,
  InscriptionActionArgs,
  InscriptionClient,
  InscriptionData,
  InscriptionElementContext,
  InscriptionMetaRequestTypes,
  InscriptionNotificationTypes,
  InscriptionRequestTypes,
  InscriptionSaveData,
  ValidationResult
} from '@axonivy/process-editor-inscription-protocol';

export class InscriptionClientJsonRpc extends BaseRpcClient implements InscriptionClient {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  protected onValidationEmitter = new Emitter<ValidationResult[]>();
  onValidation: Event<ValidationResult[]> = this.onValidationEmitter.event;

  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.onNotification('dataChanged', data => this.onDataChangedEmitter.fire(data));
    this.toDispose.push(this.onValidationEmitter);
    this.onNotification('validation', validations => this.onValidationEmitter.fire(validations));
  }

  initialize(): Promise<boolean> {
    return this.sendRequest('initialize', undefined);
  }

  data(context: InscriptionElementContext): Promise<InscriptionData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: InscriptionSaveData): Promise<ValidationResult[]> {
    return this.sendRequest('saveData', { ...saveData });
  }

  validate(context: InscriptionElementContext): Promise<ValidationResult[]> {
    return this.sendRequest('validate', { ...context });
  }

  meta<TMeta extends keyof InscriptionMetaRequestTypes>(
    path: TMeta,
    args: InscriptionMetaRequestTypes[TMeta][0]
  ): Promise<InscriptionMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: InscriptionActionArgs): void {
    this.sendNotification('action', action);
  }

  sendNotification<K extends keyof InscriptionRequestTypes>(command: K, args: InscriptionRequestTypes[K][0]): void {
    if (args === undefined) {
      this.connection.sendNotification(command);
    } else {
      this.connection.sendNotification(command, args);
    }
  }

  sendRequest<K extends keyof InscriptionRequestTypes>(
    command: K,
    args: InscriptionRequestTypes[K][0]
  ): Promise<InscriptionRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  onNotification<K extends keyof InscriptionNotificationTypes>(
    kind: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (args: InscriptionNotificationTypes[K]) => any
  ): Disposable {
    return this.connection.onNotification(kind, listener);
  }
}

export namespace InscriptionClientJsonRpc {
  export function webSocketUrl(url: string | URL) {
    return urlBuilder(url, 'ivy-inscription-lsp');
  }

  export async function startClient(connection: Connection): Promise<InscriptionClientJsonRpc> {
    return startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  export async function startMessageClient(connection: MessageConnection) {
    const client = new InscriptionClientJsonRpc(connection);
    client.start();
    return client;
  }
}
