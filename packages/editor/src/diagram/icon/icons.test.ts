import { expect, test } from 'vitest';
import { ActivityTypes, EventStartTypes } from '../view-types';
import { resolveIcon, standardIcons } from './icons';

test('resolveIcon', () => {
  expect(resolveIcon('std:Signal')).toEqual({ path: standardIcons['std:Signal'], style: 'svg' });
  expect(resolveIcon(ActivityTypes.SCRIPT)).toEqual({ path: standardIcons['std:Script'], style: 'svg' });
  expect(resolveIcon(EventStartTypes.START)).toEqual({ style: 'none' });
  expect(resolveIcon('res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png')).toEqual({
    src: 'res:/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png',
    style: 'img'
  });
  expect(
    resolveIcon('http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent')
  ).toEqual({
    src: 'http://localhost:8081/designer/faces/javax.faces.resource/layouts/images/ivy_favicon_48.png?ln=xpertivy-1-webContent',
    style: 'img'
  });
});
