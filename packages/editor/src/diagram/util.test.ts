import { describe, expect, test } from 'vitest';
import { escapeHtmlWithLineBreaks } from './util';

describe('DiagramUtils', () => {
  test('do not escape text if nothing to escape', () => {
    const text = 'Completely normal string with nothing to escape äöü_-^[]()';
    expect(escapeHtmlWithLineBreaks(text)).to.be.equals(text);
  });

  test('escape text to html', () => {
    const text = 'String with needs to be escaped <>$&/\'"';
    const escapedText = 'String with needs to be escaped &lt;&gt;$&amp;&#47;&#39;&quot;';
    expect(escapeHtmlWithLineBreaks(text)).to.be.equals(escapedText);
  });

  test('linebreaks in text will be replaced with <br/>', () => {
    const text = `String with
    linebreak`;
    const textWithLinebreaks = 'String with<br/>    linebreak';
    expect(escapeHtmlWithLineBreaks(text)).to.be.equals(textWithLinebreaks);
  });
});
