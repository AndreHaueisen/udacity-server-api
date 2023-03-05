import Store from '../../models/store';
import { BookOrder } from './dashboard_models/book_order';

export class DashboardQueries extends Store {

  // Get a book's orders
  async getBookOrders(bookId: number): Promise<BookOrder[]> {
    const conn = await this.connectToDB();

    try {
      const sql =
        'SELECT * FROM books_table INNER JOIN orders_books_table ON books_table.id = orders_books_table.book_id WHERE books_table.id=($1)';
      const result = await conn.query(sql, [bookId]);

      return result.rows.map(BookOrder.fromRow);
    } catch (err) {
      throw new Error(`Could not get books orders. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

    // Get all books that have been included in orders
    async getBooksInOrders(): Promise<BookOrder[]> {
      const conn = await this.connectToDB();
  
      try {
        const sql =
          'SELECT * FROM books_table INNER JOIN orders_books_table ON books_table.id = orders_books_table.book_id';
        const result = await conn.query(sql);
  
        return result.rows.map(BookOrder.fromRow);
      } catch (err) {
        throw new Error(`Could not get books orders. Error: ${err}`);
      } finally {
        conn.release();
      }
    }
}
