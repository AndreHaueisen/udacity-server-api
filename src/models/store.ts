import client from '../database';
import { PoolClient } from 'pg';

class Store {
  async connectToDB(): Promise<PoolClient> {
    try {
      const conn = await client.connect();
      return conn;
    } catch (err) {
      throw new Error(`Could not connect to database. Error: ${err}`);
    }
  }
}

export default Store;
