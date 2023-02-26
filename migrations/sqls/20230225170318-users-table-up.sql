CREATE TABLE IF NOT EXISTS users_table (
  username VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_digest VARCHAR NOT NULL
);