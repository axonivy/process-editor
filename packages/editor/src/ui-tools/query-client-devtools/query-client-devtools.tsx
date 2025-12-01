import {
  SetModelAction,
  SetUIExtensionVisibilityAction,
  TYPES,
  UpdateModelAction,
  type Action,
  type IActionDispatcher
} from '@eclipse-glsp/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { inject, injectable, postConstruct } from 'inversify';
import React from 'react';
import { ReactUIExtension } from '../../utils/react-ui-extension';

@injectable()
export class QueryDevTools extends ReactUIExtension {
  static readonly ID = 'ivy-query-devtools';
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  id(): string {
    return QueryDevTools.ID;
  }

  @postConstruct()
  protected init() {}

  containerClass() {
    return QueryDevTools.ID;
  }

  protected render(): React.ReactNode {
    return <ReactQueryDevtools buttonPosition='bottom-left' />;
  }

  handle(action: Action): void {
    if (SetModelAction.is(action) || UpdateModelAction.is(action)) {
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: QueryDevTools.ID, visible: true }));
    }
  }
}
