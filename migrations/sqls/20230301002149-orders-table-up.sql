CREATE TYPE status AS ENUM('open', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS orders_table (
  id SERIAL PRIMARY KEY,
  current_status status NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  username VARCHAR(40) REFERENCES users_table(username)
);