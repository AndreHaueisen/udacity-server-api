import express from 'express';

import { UserInput, UserStore } from '../../models/user';
import jwt from 'jsonwebtoken';

const users = express.Router();
const store = new UserStore(process.env.BCRYPT_SALT_ROUNDS!, process.env.BCRYPT_PASSWORD!);

users.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const user = await store.show(req.body.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

users.post('/', async (req: express.Request, res: express.Response) => {
  const user: UserInput = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET!);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export { users };
