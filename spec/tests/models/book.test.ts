import { BookStore } from '../../../src/models/book';
import {describe, expect, test} from '@jest/globals';

const store = new BookStore();

describe('Book Model', () => {
  test('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  test('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  test('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  test('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  test('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

});