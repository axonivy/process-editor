import { describe, expect, test } from 'vitest';
import { ActivityTypes, EventStartTypes } from '../view-types';
import { IconStyle, NoIcon, resolveIcon, SvgIcons } from './icons';

describe('ElementIcons', () => {
  test('element icons are correctly mapped', () => {
    expect(resolveIcon(ActivityTypes.SCRIPT)).toEqual({ res: SvgIcons.SCRIPT, style: IconStyle.SI });
    expect(resolveIcon(EventStartTypes.START)).toEqual(NoIcon);
  });

  test('show error/signal start icons', () => {
    expect(resolveIcon('std:Signal')).toEqual({ res: SvgIcons.BPMN_SIGNAL, style: IconStyle.SI });
    expect(resolveIcon('std:Error')).toEqual({ res: SvgIcons.BPMN_ERROR, style: IconStyle.SI });
    expect(resolveIcon('std:Message')).toEqual({ res: SvgIcons.BPMN_MESSAGE, style: IconStyle.SI });
    expect(resolveIcon('std:Timer')).toEqual({ res: SvgIcons.BPMN_TIMER, style: IconStyle.SI });
    expect(resolveIcon('std:Condition')).toEqual({ res: SvgIcons.BPMN_CONDITION, style: IconStyle.SI });
    expect(resolveIcon('std:Escalation')).toEqual({ res: SvgIcons.BPMN_ESCALATION, style: IconStyle.SI });
    expect(resolveIcon('std:Cancel')).toEqual({ res: SvgIcons.BPMN_CANCEL, style: IconStyle.SI });

    expect(resolveIcon('std:User')).toEqual({ res: SvgIcons.USER, style: IconStyle.SI });
    expect(resolveIcon('std:Service')).toEqual({ res: SvgIcons.SERVICE, style: IconStyle.SI });
    expect(resolveIcon('std:Send')).toEqual({ res: SvgIcons.SEND, style: IconStyle.SI });
    expect(resolveIcon('std:Script')).toEqual({ res: SvgIcons.SCRIPT, style: IconStyle.SI });
    expect(resolveIcon('std:Receive')).toEqual({ res: SvgIcons.RECEIVE, style: IconStyle.SI });
    expect(resolveIcon('std:Manual')).toEqual({ res: SvgIcons.MANUAL, style: IconStyle.SI });
    expect(resolveIcon('std:Rule')).toEqual({ res: SvgIcons.RULE, style: IconStyle.SI });
    expect(resolveIcon('std:Alternative')).toEqual({ res: SvgIcons.ALTERNATIVE, style: IconStyle.SI });
  });

  test('external icons are replaced by generic icon', () => {
    expect(resolveIcon('ext:1131930634')).toEqual({ res: SvgIcons.PUZZLE, style: IconStyle.SI });
  });

  test('resource icons are the same as delivered from the server', () => {
    expect(resolveIcon('res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png')).toEqual({
      res: 'res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png',
      style: IconStyle.IMG
    });
    expect(
      resolveIcon('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent')
    ).toEqual({
      res: 'http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent',
      style: IconStyle.IMG
    });
  });
});
