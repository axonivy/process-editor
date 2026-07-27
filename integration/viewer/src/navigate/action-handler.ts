import type { Action, IActionHandler } from '@eclipse-glsp/client';
import { NavigateToExternalTargetAction, NavigationTarget } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class NavigateToExternalTargetActionHandler implements IActionHandler {
  handle(action: Action): void {
    if (NavigateToExternalTargetAction.is(action)) {
      window.open(this.evaluateTargetUrl(action.target), '_self');
    }
  }

  private evaluateTargetUrl(target: NavigationTarget): string {
    const url = new URL(window.location.href);
    url.searchParams.set('project', this.evaluateProject(target));

    const processPid = this.getArg(target, 'processPid');
    if (processPid) {
      url.searchParams.set('pid', processPid);
      url.searchParams.delete('file');
    } else {
      const file = target.uri.substring(this.indexOfProjectSlashInUri(target.uri));
      url.searchParams.set('file', file);
      url.searchParams.delete('pid');
    }

    const select = this.getArg(target, NavigationTarget.ELEMENT_IDS);
    if (select) {
      url.searchParams.set('select', select);
    }

    return url.toString();
  }

  private evaluateProject(target: NavigationTarget): string {
    const project = this.getArg(target, 'project');
    return project ? project : target.uri.substring(1, this.indexOfProjectSlashInUri(target.uri));
  }

  private indexOfProjectSlashInUri(targetUri: string): number {
    return targetUri.indexOf('/', 1);
  }

  private getArg(target: NavigationTarget, argName: string): string | undefined {
    if (target.args && target.args[argName]) {
      return target.args[argName].toString();
    }
    return undefined;
  }
}
