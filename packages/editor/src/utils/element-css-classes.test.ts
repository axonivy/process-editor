import { GNode, addCssClassToElements, addCssClasses, removeCssClassOfElements, removeCssClasses } from '@eclipse-glsp/client';
import { afterEach, describe, expect, test } from 'vitest';

describe('ElementCssClassesUtil', () => {
  const node = new GNode();
  const node2 = new GNode();

  afterEach(() => {
    node.cssClasses = undefined;
    node2.cssClasses = undefined;
  });

  test('addCssClass', () => {
    addCssClasses(node, 'test');
    expect(node.cssClasses).to.include('test');
  });

  test('addCssClass only once', () => {
    addCssClasses(node, 'test');
    addCssClasses(node, 'test');
    addCssClasses(node, 'test2');
    expect(node.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
  });

  test('removeCssClass', () => {
    node.cssClasses = ['bla', 'test'];
    removeCssClasses(node, 'test');
    expect(node.cssClasses).to.include('bla').but.not.to.include('test');
  });

  test('removeCssClass of empty array', () => {
    removeCssClasses(node, 'nothingToRemove');
    expect(node.cssClasses).toBeUndefined();
  });

  test('addCssClassToElements', () => {
    addCssClassToElements([node, node2], 'test');
    expect(node.cssClasses).to.include('test');
    expect(node2.cssClasses).to.include('test');
  });

  test('addCssClassToElements only once', () => {
    addCssClassToElements([node, node2], 'test');
    addCssClassToElements([node, node2], 'test');
    addCssClassToElements([node, node2], 'test2');
    expect(node.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
    expect(node2.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
  });

  test('removeCssClassOfElements', () => {
    node.cssClasses = ['bla', 'test'];
    node2.cssClasses = ['bla', 'test'];
    removeCssClassOfElements([node, node2], 'test');
    expect(node.cssClasses).to.include('bla').but.not.to.include('test');
    expect(node2.cssClasses).to.include('bla').but.not.to.include('test');
  });

  test('removeCssClassOfElements of empty array', () => {
    removeCssClassOfElements([node, node2], 'nothingToRemove');
    expect(node.cssClasses).toBeUndefined();
    expect(node2.cssClasses).toBeUndefined();
  });
});
