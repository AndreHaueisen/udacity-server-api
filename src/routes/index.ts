import express from 'express';
import { books } from './api/books';
import { users } from './api/users';

const routes = express.Router();

routes.use('/books', books);
routes.use('/users', users);

export { routes };
