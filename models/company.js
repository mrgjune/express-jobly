const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
class Company {
    /**insert a company in companies database */
    static async create({ handle, name, num_employees, description, logo_url }) {
        const result = await db.query(
            `INSERT INTO companies (handle, name, num_employees, description, logo_url)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING handle, name, num_employees, description, logo_url`,
            [handle, name, num_employees, description, logo_url]
        );

        return result.rows[0]
    }
    /**takes in a search term and returns the companies with that search term */
    static async search(searchTerm, minEmployees = 0, maxEmployees = 1000000) {

        let result;
        if (searchTerm === undefined) {
            result = await db.query(
            `SELECT handle, name
            FROM companies
            WHERE num_employees >= $1
            AND num_employees <= $2`,
                [minEmployees, maxEmployees])
        } else {
            searchTerm = `%${searchTerm}%`;
            result = await db.query(
                `SELECT handle, name
                FROM companies
                WHERE name ILIKE $1
                AND num_employees >= $2
                AND num_employees <= $3`,
                [searchTerm, minEmployees, maxEmployees]
            )
        }

        return result.rows;

    }

    static async getCompany(handle) {
        let result = await db.query(
            `SELECT handle, name, num_employees, description, logo_url
                FROM companies
                WHERE handle = $1`,
            [handle]
        )
        return result.rows[0];
    }

    /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed company.
   *
   */

  static async update(handle, data) {
    let { query, values } = sqlForPartialUpdate(
      "companies",
      data,
      "handle",
      handle
    );

    const result = await db.query(query, values);
    const company = result.rows[0];

    if (!company) {
      throw new ExpressError(`There exists no company '${handle}`, 404);
    }

    return company;
  }



}

module.exports = Company;