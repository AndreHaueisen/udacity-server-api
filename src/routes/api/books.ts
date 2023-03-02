import express, { Request, Response } from 'express';
import { BookStore, Book } from '../../models/book';
import { verifyAuthToken } from '../../utils/helpers';

const books = express.Router();
const store = new BookStore();

books.get('/', async (_: Request, res: Response) => {
  try {
    const books = await store.index();

    res.json(books);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

books.get('/:id', async (req: Request, res: Response) => {
  try {
    const book = await store.show(req.params.id as unknown as number);
    res.json(book);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

books.get('/:id/orders', async (req: Request, res: Response) => {
  try {
    const bookOrders = await store.getBooksOrders(req.params.id as unknown as number);
    res.json(bookOrders);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

books.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const rawBook = req.body;
    const newBook = await store.create({
      title: rawBook.title,
      author: rawBook.author,
      totalPages: rawBook.totalPages as unknown as number,
      summary: rawBook.summary
    });

    res.json(newBook);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

books.put('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const rawBook = req.body;
    const updatedBook = await store.update(
      new Book(
        rawBook.id as unknown as number,
        rawBook.title,
        rawBook.author,
        rawBook.totalPages as unknown as number,
        rawBook.summary
      )
    );
    res.json(updatedBook);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

books.delete('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    await store.delete(req.params.id as unknown as number);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export { books };
