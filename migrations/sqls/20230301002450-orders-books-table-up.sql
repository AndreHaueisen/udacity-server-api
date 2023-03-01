CREATE TABLE IF NOT EXISTS orders_books_table (
  id SERIAL PRIMARY KEY,
  quantity INT NOT NULL,
  order_id bigint REFERENCES orders_table(id),
  book_id bigint REFERENCES books_table(id)
);