import { describe, expect, test } from 'vitest';
import { moveIntoViewport } from './viewport-commands';

describe('MoveIntoViewportCommand', () => {
  const viewPort = { x: 0, y: 0, width: 500, height: 500 };
  const zoom = 1;

  test('inside viewport', () => {
    const currentScrollPos = { x: 0, y: 0 };
    const elementPos = { x: 50, y: 50 };
    const result = moveIntoViewport(viewPort, currentScrollPos, elementPos, zoom);
    expect(result.scroll).to.be.deep.equals({ x: 0, y: 0 });
  });

  test('element right outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: 550, y: 50 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: 300, y: 0 });

    const scrollOutside = moveIntoViewport(viewPort, { x: -600, y: 0 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: -200, y: 0 });
  });

  test('element bottom outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: 50, y: 550 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: 0, y: 300 });

    const scrollOutside = moveIntoViewport(viewPort, { x: 0, y: -600 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: 0, y: -200 });
  });

  test('element bottom and right outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: 550, y: 550 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: 300, y: 300 });

    const scrollOutside = moveIntoViewport(viewPort, { x: -600, y: -600 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: -200, y: -200 });
  });

  test('element left outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: -50, y: 50 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: -300, y: 0 });

    const scrollOutside = moveIntoViewport(viewPort, { x: 600, y: 0 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: -200, y: 0 });
  });

  test('element top outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: 50, y: -50 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: 0, y: -300 });

    const scrollOutside = moveIntoViewport(viewPort, { x: 0, y: 600 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: 0, y: -200 });
  });

  test('element right bottom outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: 550, y: 550 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: 300, y: 300 });

    const scrollOutside = moveIntoViewport(viewPort, { x: -600, y: -600 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: -200, y: -200 });
  });

  test('element left top outside viewport', () => {
    const elementOutside = moveIntoViewport(viewPort, { x: 0, y: 0 }, { x: -50, y: -50 }, zoom);
    expect(elementOutside.scroll).to.be.deep.equals({ x: -300, y: -300 });

    const scrollOutside = moveIntoViewport(viewPort, { x: 600, y: 600 }, { x: 50, y: 50 }, zoom);
    expect(scrollOutside.scroll).to.be.deep.equals({ x: -200, y: -200 });
  });
});
