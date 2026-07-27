export namespace URLParams {
  export function parameter(key: string): string | undefined {
    const param = new URLSearchParams(window.location.search).get(key);
    return param !== null ? decodeURIComponent(param) : undefined;
  }

  export function app(): string {
    return parameter('app') ?? '';
  }

  export function project(): string {
    return parameter('project') ?? '';
  }

  export function pid(): string {
    return parameter('pid') ?? '';
  }

  export function webSocketBase(): string {
    return `${isSecureConnection() ? 'wss' : 'ws'}://${server()}`;
  }

  export function themeMode(): 'dark' | 'light' {
    const theme = parameter('theme');
    if (theme === 'dark') {
      return theme;
    }
    if (theme === 'light') {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const isSecureConnection = () => {
    const secureParam = parameter('secure');
    if (secureParam === 'true') {
      return true;
    }
    if (secureParam === 'false') {
      return false;
    }
    return window.location.protocol === 'https:';
  };

  const server = () => {
    return parameter('server') ?? basePath();
  };

  const basePath = () => {
    const protocol = window.location.protocol;
    const href = window.location.href;
    if (href.includes('/process-inscription')) {
      return href.substring(protocol.length + 2, href.indexOf('/process-inscription'));
    }
    return 'localhost:8081';
  };
}
