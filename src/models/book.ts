import Store from './store';

export class Book {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly author: string,
    readonly totalPages: number,
    readonly summary: string
  ) {}

  static fromRow(row: BookRow): Book {
    return new Book(row.id, row.title, row.author, row.total_pages, row.summary);
  }
}

export type BookInput = {
  title: string;
  author: string;
  totalPages: number;
  summary: string;
};

interface BookRow {
  id: number;
  title: string;
  author: string;
  total_pages: number;
  summary: string;
}

export class BookOrder {
  constructor(readonly bookId: number, readonly orderId: number, readonly quantity: number, readonly title: string) {}

  static fromRow(row: BookOrderRow): BookOrder {
    return new BookOrder(row.book_id, row.order_id, row.quantity, row.title);
  }
}

interface BookOrderRow {
  book_id: number;
  order_id: number;
  quantity: number;
  title: string;
}

export class BookStore extends Store {
  async index(): Promise<Book[]> {
    const conn = await this.connectToDB();

    try {
      const sql = 'SELECT * FROM books_table';
      const result = await conn.query(sql);

      return result.rows.map(Book.fromRow);
    } catch (err) {
      throw new Error(`Could not get books. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Book> {
    const conn = await this.connectToDB();
    try {
      const sql = 'SELECT * FROM books_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      return Book.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find book ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(book: BookInput): Promise<Book> {
    const conn = await this.connectToDB();
    try {
      const sql = 'INSERT INTO books_table (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [book.title, book.author, book.totalPages, book.summary]);
      const newBook = result.rows[0];

      return Book.fromRow(newBook);
    } catch (err) {
      throw new Error(`Could not add new book ${book.title}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async update(book: Book): Promise<Book> {
    const conn = await this.connectToDB();

    try {
      const sql =
        'UPDATE books_table SET title=($1), author=($2), total_pages=($3), summary=($4) WHERE id=($5) RETURNING *';
      const result = await conn.query(sql, [book.title, book.author, book.totalPages, book.summary, book.id]);
      const updatedBook = result.rows[0];

      return Book.fromRow(updatedBook);
    } catch (err) {
      throw new Error(`Could not update book ${book.id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async delete(id: number): Promise<void> {
    const conn = await this.connectToDB();

    try {
      const sql = 'DELETE FROM books_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rowCount === 0) {
        throw new Error(`Could not find book ${id}`);
      }

      return;
    } catch (err) {
      throw new Error(`Could not delete book ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async getBooksOrders(id: number): Promise<BookOrder[]> {
    const conn = await this.connectToDB();

    try {
      const sql =
        'SELECT * FROM books_table INNER JOIN orders_books_table ON books_table.id = orders_books_table.book_id WHERE books_table.id=($1)';
      const result = await conn.query(sql, [id]);

      return result.rows.map(BookOrder.fromRow);
    } catch (err) {
      throw new Error(`Could not get books orders. Error: ${err}`);
    } finally {
      conn.release();
    }
  }
}
