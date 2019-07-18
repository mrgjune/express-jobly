const express = require("express");
const router = new express.Router();
const Company = require("../models/company")
const ExpressError = require("../helpers/expressError")
const sqlForPartialUpdate = require("../helpers/partialUpdate")
const db = require("../db")
const jsonschema = require("jsonschema");
const patchCompanySchema = require("../schemas/patchCompanySchema")
const postCompanySchema = require("../schemas/postCompanySchema")


/** GET companies by search terms */
router.get("/", async function (req, res, next) {
  let searchName = req.query.searchName;
  let minEmployees = (req.query.minEmployees);
  let maxEmployees = (req.query.maxEmployees);
  try {
    if (minEmployees < maxEmployees || minEmployees === undefined || maxEmployees === undefined || searchName === undefined) {
      let companies = await Company.search(searchName, minEmployees, maxEmployees)

      if (companies.length !== 0){
            return res.json({ companies })
      }
      throw new ExpressError("Params are not valid", 400);
    }
          
    throw new ExpressError("Params are not valid", 400);
  } catch (err) {
    return next(err)
  }

})

/**POST/companies, return JSON of {company: companyData} */
router.post("/", async function (req, res, next) {

  try {
    const result = jsonschema.validate(req.body, postCompanySchema)

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack)
      throw new ExpressError(listOfErrors, 400)
      
      // return next(err)
    }

    let companies = await Company.create(req.body);
    return res.json({ companies })
  } catch (err) {
    return next(err)
  }
})

/**GET/companies/[handle], return JSON of {company: companyData} */
router.get("/:handle", async function (req, res, next) {
  let handle = req.params.handle;
  try {
    let company = await Company.get(handle);

    if (company) {
      return res.json({ company })
    }
    throw new ExpressError("Company Not Found", 404);


  } catch (err) {
    return next(err)
  }
})


/**PATCH, update company routes by handle */
router.patch("/:handle", async function (req, res, next) {
  let handle = req.params.handle;
  let items = req.body.items

  try {

    let updateCompany = sqlForPartialUpdate("companies", items, "handle", handle)

    const validateResult = jsonschema.validate(items, patchCompanySchema)
    if (!validateResult.valid) {

      let listOfErrors = validateResult.errors.map(error => error.stack);
      let err = new ExpressError(listOfErrors, 400);
      // FIXME: jsut throw this
      return next(err)

    }
    const result = await db.query(updateCompany.query, updateCompany.values)
    if (result.rowCount !== 0) {
      let company = result.rows[0]
      return res.json({ company })
    }
    throw new ExpressError("Company Not Found", 404);

  } catch (err) {
    return next(err)
  }
})

/**DELETE/companies/[handle], return JSON of {message: "Company deleted"} */
router.delete("/:handle", async function (req, res, next) {
  let handle = req.params.handle;
  try {
    const result = await db.query(`DELETE FROM companies WHERE handle=$1`, [handle])
    if (result.rowCount !== 0) {
      return res.json({ message: "Company deleted" })
    }

    throw new ExpressError("Company Not Found", 404);
  } catch (err) {
    return next(err)
  }
})



module.exports = router; 