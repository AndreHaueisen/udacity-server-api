import express from 'express';
import { books } from './api/books';

const routes = express.Router();

routes.use('/books', books);

export { routes };
