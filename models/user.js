const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");
const ExpressError = require("../helpers/ExpressError");

class User {

    /**insert a user in user table */
    static async create({ username, password, first_name, last_name, email, photo_url, is_admin }) {
        const result = await db.query(
            `INSERT INTO users (username, password, first_name, last_name,email,photo_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, password, first_name, last_name,email,photo_url`,
            [username, password, first_name, last_name, email, photo_url]
        );

        return result.rows[0]
    }

    static async getAll() {
        let result = await db.query(
            `SELECT username, first_name, last_name,email,photo_url FROM users`);
        return result.rows;
    }
    static async get(username) {
        let result = await db.query(
            `SELECT first_name, last_name, email, photo_url
                FROM users
                WHERE username = $1`,
            [username]
        )
        console.log(result.rows[0])
        return result.rows[0];
    }
   /**update user info by username */
    static async update(username, data) {
        // if (data.password) {
        //   data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        // }
        let { query, values } = partialUpdate("users", data, "username", username);
    
        const result = await db.query(query, values);
        const user = result.rows[0];
        if (!user) {
          throw new ExpressError(`There exists no user '${username}'`, 404);
        }
       
        delete user.password;
        // delete user.is_admin;
        return result.rows[0];
      }



  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
        `DELETE FROM users 
        WHERE username = $1
        RETURNING username`,
        [username]
    );

    if (result.rows.length === 0) {
        throw new ExpressError(`There exists no user '${username}'`, 404);
    }
}
}




module.exports = User;
