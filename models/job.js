const db = require("../db");

class Job {
  /**insert a job in job table */
  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]
    );

    return result.rows[0]
  }

  /**takes in search term and returns the jobs with that search term */
  static async search(searchTerm, minSalary = 0, maxSalary = 1000000000) {
    let result;
    if (searchTerm === undefined) {
      result = await db.query(
        `SELECT title, company_handle, salary, date_posted
            FROM jobs
            WHERE salary >= $1
            AND salary <= $2
            ORDER BY date_posted DESC`,
        [minSalary, maxSalary])
    } else {
      searchTerm = `%${searchTerm}%`;
      result = await db.query(
        `SELECT title, company_handle, salary, date_posted
            FROM jobs
            WHERE title ILIKE $1
            AND salary >= $2
            AND salary <= $3
            ORDER BY date_posted DESC`,
        [searchTerm, minSalary, maxSalary]
      )
    }

    return result.rows;
  }
  /**get a job by its id */
  static async get(id) {
    let result = await db.query(
          `SELECT j.id AS job_id , 
              j.title AS job_title, 
              j.salary, 
              j.equity AS job_equity,
              j.date_posted AS date_posted,
              c.name AS company_name, 
              c.num_employees, 
              c.description, 
              c.logo_url
            FROM companies AS c
            JOIN jobs AS j
            ON c.handle = j.company_handle
            WHERE j.id = $1`,
        [id]
    )
    return result.rows[0];
  }

  static async getJobs(handle) {
    let result = await db.query(
          `SELECT j.id AS job_id , 
              j.title AS job_title, 
              j.salary, 
              j.equity AS job_equity,
              j.date_posted AS date_posted
            FROM jobs AS j
            JOIN companies AS c
            ON c.handle = j.company_handle
            WHERE j.company_handle = $1`,
        [handle]
    )
    return result.rows;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed job.
   *
   */

/** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed job.
   *
   */

  static async update(id, data) {
    let { query, values } = sqlForPartialUpdate("jobs", data, "id", id);

    const result = await db.query(query, values);
    const job = result.rows[0];

    if (!job) {
      throw new ExpressError(`There exists no job '${id}`, 404);
    }

    return job;
  }

  /** Delete given job from database; returns undefined. */

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs 
        WHERE id = $1 
        RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`There exists no job '${id}`, 404);
    }
  }
}
module.exports = Job;

