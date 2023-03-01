import express from 'express';
import { books } from './api/books';
import { users } from './api/users';
import { orders } from './api/orders';

const routes = express.Router();

routes.use('/books', books);
routes.use('/users', users);
routes.use('/orders', orders);

export { routes };
