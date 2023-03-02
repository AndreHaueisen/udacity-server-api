import express, { Request, Response } from 'express';
import { OrderStore } from '../../models/order';
import { verifyAuthToken } from '../../utils/helpers';

const orders = express.Router();
const store = new OrderStore();

orders.get('/', async (_: Request, res: Response) => {
  try {
    const orders = await store.index();

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id as unknown as number);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.get('/:id/books', async (req: Request, res: Response) => {
  try {
    const orderBooks = await store.getOrdersBooks(req.params.id as unknown as number);
    res.json(orderBooks);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const rawOrderInput = req.body;
    const newOrder = await store.create({
      username: rawOrderInput.username
    });

    res.json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.put('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const rawUpdateOrderInput = req.body;
    const updatedOrder = await store.update(rawUpdateOrderInput.id as unknown as number, {
      currentStatus: rawUpdateOrderInput.status
    });

    res.json(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.delete('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const deletedOrder = await store.delete(req.params.id as unknown as number);
    res.json(deletedOrder);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.post('/:id/books', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const rawOrderBooktInput = req.body;
    const newOrderBook = await store.addBook({
      orderId: req.params.id as unknown as number,
      bookId: rawOrderBooktInput.bookId,
      quantity: rawOrderBooktInput.quantity
    });

    res.json(newOrderBook);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export { orders };
