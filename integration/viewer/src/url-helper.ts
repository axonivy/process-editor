import type { ThemeMode } from '@axonivy/process-editor-protocol';

export const params = (url: URL, defaultTheme?: () => ThemeMode) => {
  const parameters = new URLSearchParams(url.search);
  const app = parameters.get('app') ?? '';
  let server = parameters.get('server');
  let appendApp = true;
  if (!server) {
    server = serverDomain(url, app);
    appendApp = false;
  }
  const secure = parameters.get('secure') === 'true';
  const webSocketProtocol = url.protocol === 'https:' || secure ? 'wss' : 'ws';
  const webSocketUrl = appendApp ? `${webSocketProtocol}://${server}/${app}/1` : `${webSocketProtocol}://${server}`;
  return {
    webSocketUrl,
    app,
    pmv: parameters.get('pmv') ?? '',
    pid: parameters.get('pid') ?? '',
    sourceUri: parameters.get('file') ?? '',
    highlight: parameters.get('highlight') ?? '',
    select: parameters.get('select'),
    zoom: parameters.get('zoom') ?? '',
    theme: (parameters.get('theme') as ThemeMode) ?? defaultTheme?.(),
    previewMode: parameters.get('mode') === 'preview'
  };
};

const serverDomain = (url: URL, app: string) => {
  const protocol = url.protocol;
  if (protocol.startsWith('http')) {
    const href = url.href;
    const appIndex = href.indexOf(`/${app}/`);
    if (appIndex !== -1) {
      const processViewerIndex = href.indexOf('/process-viewer', appIndex);
      if (processViewerIndex !== -1) {
        return href.substring(protocol.length + 2, processViewerIndex);
      }
    }
  }
  return 'localhost:8081';
};
