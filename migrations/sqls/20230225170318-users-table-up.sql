CREATE TABLE IF NOT EXISTS users_table (
  id SERIAL PRIMARY KEY,
  fist_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password_digest VARCHAR NOT NULL
);