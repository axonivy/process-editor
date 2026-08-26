export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || getParameters().get('secure') === 'true';
}

export function isReadonly(): boolean {
  return getParameters().get('readonly') === 'true';
}

export function getParameters() {
  return new URLSearchParams(window.location.search);
}
