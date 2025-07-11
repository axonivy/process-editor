import { GLSPCommandStack, GModelRoot, type IActionDispatcher, RedoAction, TYPES, UndoAction } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class IvyGLSPCommandStack extends GLSPCommandStack {
  @inject(TYPES.IActionDispatcherProvider) protected actionDispatcher: () => Promise<IActionDispatcher>;

  override undo(): Promise<GModelRoot> {
    this.actionDispatcher().then(dispatcher => dispatcher.dispatch(UndoAction.create()));
    return this.thenUpdate();
  }

  override redo(): Promise<GModelRoot> {
    this.actionDispatcher().then(dispatcher => dispatcher.dispatch(RedoAction.create()));
    return this.thenUpdate();
  }
}
