import Store from './store';

// Order ------------------------------------------------

export class Order {
  constructor(readonly id: number, _status: OrderStatus, _createdAt: Date, readonly username: string) {}

  static fromRow(row: OrderRow): Order {
    const status = OrderStatus[row.current_status as keyof typeof OrderStatus];
    return new Order(row.id, status, row.created_at, row.username);
  }
}

export type OrderInput = {
  username: string;
};

export type UpdateOrderInput = {
  currentStatus: OrderStatus;
};

interface OrderRow {
  id: number;
  current_status: OrderStatus;
  created_at: Date;
  username: string;
}

// OrderBook --------------------------------------------

export class OrderBook {
  constructor(readonly orderId: number, readonly bookId: number, readonly quantity: number) {}

  static fromRow(row: OrderBookRow): OrderBook {
    return new OrderBook(row.order_id, row.book_id, row.quantity);
  }
}

export type OrderBookInput = {
  orderId: number;
  bookId: number;
  quantity: number;
};

interface OrderBookRow {
  order_id: number;
  book_id: number;
  quantity: number;
}

enum OrderStatus {
  open = 'open',
  cancelled = 'cancelled',
  completed = 'completed'
}

export class OrderStore extends Store {
  async index(): Promise<Order[]> {
    const conn = await this.connectToDB();

    try {
      const sql = 'SELECT * FROM orders_table';
      const result = await conn.query(sql);

      return result.rows.map(Order.fromRow);
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Order> {
    const conn = await this.connectToDB();
    try {
      const sql = 'SELECT * FROM orders_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(orderInput: OrderInput): Promise<Order> {
    const conn = await this.connectToDB();

    try {
      const sql = 'INSERT INTO orders_table (current_status, username) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [OrderStatus.open, orderInput.username]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async update(id: number, orderInput: UpdateOrderInput): Promise<Order> {
    const conn = await this.connectToDB();

    try {
      const sql = 'UPDATE orders_table SET current_status=($1) WHERE id=($2) RETURNING *';
      const result = await conn.query(sql, [orderInput.currentStatus, id]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<void> {
    const conn = await this.connectToDB();

    try {
      const sql = 'DELETE FROM orders_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rowCount === 0) {
        throw new Error(`Could not find order ${id}.`);
      }

      return;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async addBook(orderBookInput: OrderBookInput): Promise<OrderBook> {
    const conn = await this.connectToDB();

    try {
      const sql = 'INSERT INTO orders_books_table (order_id, book_id, quantity) VALUES($1, $2, $3) RETURNING *';

      const result = await conn.query(sql, [orderBookInput.orderId, orderBookInput.bookId, orderBookInput.quantity]);
      return OrderBook.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not add book to order. Error: ${err}`);
    } finally {
      conn.release();
    }
  }
}
