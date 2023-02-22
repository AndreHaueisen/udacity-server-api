import { Book, BookStore } from '../../../src/models/book';
import {describe, expect, test} from '@jest/globals';
import client from '../../../src/database';

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

  test('create should add a book', async () => {
    const result = await store.create({
      title: 'Test Book',
      author: 'Test Author',
      totalPages: 100,
      summary: 'Test Summary',
    });

    await client.end();

    expect(result).toEqual(new Book(
       1,
       'Test Book',
      'Test Author',
       100,
       'Test Summary',
    ));

  });

});