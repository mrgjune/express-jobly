const db = require("../db");
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
    static async search(searchTerm, minEmployees=0, maxEmployees=1000000) {
        if (searchTerm !== undefined) {
            searchTerm = `%${searchTerm}%`; 
        }
        console.log("SEARCHTERM:", searchTerm)
   
        let result;
        if (searchTerm === undefined){
           result = await db.query( 
            `SELECT handle, name
            FROM companies
            WHERE num_employees >= $1
            AND num_employees <= $2`,
            [minEmployees,maxEmployees])
            console.log("LOOOOOOOOOOOOOOK", typeof maxEmployees)
        } else {
            result = await db.query(
            `SELECT handle, name
            FROM companies
            WHERE name ILIKE $1
            AND num_employees >= $2
            AND num_employees <= $3`,
            [searchTerm,minEmployees,maxEmployees])
            console.log("searchTerm:", searchTerm, "min:", minEmployees, "max:", maxEmployees)
            console.log("RESULT:", result)
            }

            
        if (!result) {
            throw err;
        } else {
            return result.rows[0];
        }
    }


}

module.exports = Company;



