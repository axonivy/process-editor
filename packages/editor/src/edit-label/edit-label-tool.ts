import { DirectLabelEditTool } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyDirectLabelEditTool extends DirectLabelEditTool {
  override enable(): void {
    // we do not use the mouse listener, just the key listener
    this.toDisposeOnDisable.push(this.keyTool.registerListener(this.createEditLabelKeyListener()));
  }
}
