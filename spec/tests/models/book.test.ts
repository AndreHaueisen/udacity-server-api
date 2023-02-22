import { Book, BookStore } from '../../../src/models/book';
import { describe, expect, test } from '@jest/globals';
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
      summary: 'Test Summary'
    });

    expect(result).toEqual(new Book(1, 'Test Book', 'Test Author', 100, 'Test Summary'));
  });

  test('index should return a list of books', async () => {
    const result = await store.index();

    expect(result).toEqual([new Book(1, 'Test Book', 'Test Author', 100, 'Test Summary')]);
  });

  test('show should return the correct book', async () => {
    const result = await store.show(1);

    expect(result).toEqual(new Book(1, 'Test Book', 'Test Author', 100, 'Test Summary'));
  });

  test('update should update the book', async () => {
    const result = await store.update(new Book(1, 'Updated Book', 'Updated Author', 10, 'Updated Summary'));

    expect(result).toEqual(new Book(1, 'Updated Book', 'Updated Author', 10, 'Updated Summary'));
  });

  test('delete should remove the book', async () => {
    await store.delete(1);
    const result = await store.index();

    expect(result).toEqual([]);
  });

  afterAll(async () => {
    await client.end();
  });
});
