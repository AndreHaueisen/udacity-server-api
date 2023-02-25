import Store from './store';
import bcrypt from 'bcrypt';

export class User {
  constructor(
    readonly id: number,
    readonly first_name: string,
    readonly last_name: string,
    readonly username: string,
    readonly passwordDigest: string
  ) {}

  static fromRow(row: UserRow): User {
    return new User(row.id, row.first_name, row.last_name, row.username, row.passwordDigest);
  }
}

export type UserInput = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  passwordDigest: string;
}

export class UserStore extends Store {
  constructor(readonly saltRounds: string, readonly pepper: string) {
    super();
  }

  async show(id: number): Promise<User | null> {
    const conn = await this.connectToDB();

    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rows.length) {
        return User.fromRow(result.rows[0]);
      }

      return null;
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(user: UserInput): Promise<User> {
    const conn = await this.connectToDB();

    try {
      const sql =
        'INSERT INTO users (first_name, last_name, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(user.password + this.pepper, parseInt(this.saltRounds));

      const result = await conn.query(sql, [user.username, hash]);
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
      const sql = 'SELECT password FROM users WHERE username=($1)';
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
