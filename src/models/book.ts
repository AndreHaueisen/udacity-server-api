import client from "../database";

export class Book {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly author: string,
    readonly totalPages: number,
    readonly summary: string
  ) {}

  static fromRow(row: BookRow): Book {
    return new Book(
      row.id,
      row.title,
      row.author,
      row.total_pages,
      row.summary
    );
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

export class BookStore {

  async index(): Promise<Book[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM books_table';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get books. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM books_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find book ${id}. Error: ${err}`);
    }
  }

  async create(book: BookInput): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO books_table (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [book.title, book.author, book.totalPages, book.summary]);
      const newBook = result.rows[0];
      conn.release();

      return Book.fromRow(newBook);
    } catch (err) {
      throw new Error(`Could not add new book ${book.title}. Error: ${err}`);
    }
  }

  async update(book: Book): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE books_table SET title=($1), author=($2), total_pages=($3), summary=($4) WHERE id=($5) RETURNING *';
      const result = await conn.query(sql, [book.title, book.author, book.totalPages, book.summary, book.id]);
      const updatedBook = result.rows[0];
      conn.release();

      return updatedBook;
    } catch (err) {
      throw new Error(`Could not update book ${book.id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Book> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM books_table WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      const deletedBook = result.rows[0];
      conn.release();

      return deletedBook;
    } catch (err) {
      throw new Error(`Could not delete book ${id}. Error: ${err}`);
    }
  }

}