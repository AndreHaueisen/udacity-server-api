import Store from './store';
import bcrypt from 'bcrypt';

export class User {
  constructor(
    readonly username: string,
    readonly first_name: string,
    readonly last_name: string,
    readonly passwordDigest: string
  ) {}

  static fromRow(row: UserRow): User {
    return new User(row.username, row.first_name, row.last_name, row.passwordDigest);
  }
}

export type UserInput = {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
};

interface UserRow {
  username: string;
  first_name: string;
  last_name: string;
  passwordDigest: string;
}

export class UserStore extends Store {
  constructor(readonly saltRounds: string, readonly pepper: string) {
    super();
  }

  async show(username: string): Promise<User | null> {
    const conn = await this.connectToDB();

    try {
      const sql = 'SELECT * FROM users_table WHERE username=($1)';
      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        return User.fromRow(result.rows[0]);
      }

      return null;
    } catch (err) {
      throw new Error(`Could not find user ${username}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(user: UserInput): Promise<User> {
    const conn = await this.connectToDB();

    try {
      const sql =
        'INSERT INTO users_table (username, first_name, last_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const passwordHash = bcrypt.hashSync(user.password + this.pepper, parseInt(this.saltRounds));

      const result = await conn.query(sql, [user.username, user.first_name, user.last_name, passwordHash]);
      const newUser = result.rows[0];

      return User.fromRow(newUser);
    } catch (err) {
      throw new Error(`Could not add new user ${user.username}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await this.connectToDB();

    try {
      const sql = 'SELECT password FROM users_table WHERE username=($1)';
      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        const rawUser = result.rows[0];
        const user = User.fromRow(rawUser);
        console.log(rawUser);

        if (bcrypt.compareSync(password + this.pepper, user.passwordDigest)) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${username}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }
}
