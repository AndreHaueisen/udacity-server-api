import express, { Request, Response } from 'express';
import { DashboardQueries } from './dashboard';

const dashboard = express.Router();
const queries = new DashboardQueries();

dashboard.get('/bookOrders/:id', async (req: Request, res: Response) => {
  try {
    const bookOrders = await queries.getBookOrders(req.params.id as unknown as number);
    res.json(bookOrders);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

dashboard.get('/booksInOrders', async (_: Request, res: Response) => {
  try {
    const booksInOrders = await queries.getBooksInOrders();
    res.json(booksInOrders);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export { dashboard };
