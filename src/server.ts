import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { routes } from './routes/index';
import logger from './utils/logger';

const app: express.Application = express();
const port = 3000;
const address = '0.0.0.0:3000';

const corsOptions = {
  origin: address,
  optionsSuccessStatus: 200
};

app.all('*', logger);
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});
