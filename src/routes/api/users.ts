import express from 'express';

import { UserInput, UserStore } from '../../models/user';
import jwt from 'jsonwebtoken';

const users = express.Router();
const store = new UserStore(process.env.BCRYPT_SALT_ROUNDS!, process.env.BCRYPT_PASSWORD!);

users.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const user = await store.show(req.body.username);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

users.get('/authenticate', async (req: express.Request, res: express.Response) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await store.authenticate(username, password);
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET!);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

users.post('/', async (req: express.Request, res: express.Response) => {
  const user: UserInput = {
    username: req.body.username,
    firstName: req.body.first_name,
    lastName: req.body.last_name,
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
