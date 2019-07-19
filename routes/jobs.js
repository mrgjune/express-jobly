const express = require("express");
const router = new express.Router();
const Job = require("../models/job")
const ExpressError = require("../helpers/expressError")
const sqlForPartialUpdate = require("../helpers/partialUpdate")
const db = require("../db")
const jsonschema = require("jsonschema");
const patchJobSchema = require("../schemas/patchJobSchema")
const postJobSchema = require("../schemas/postJobSchema")


/** POST/jobs, return JSON of {job: jobData} */
router.post("/", async function (req, res, next) {

  try {
    const result = jsonschema.validate(req.body, postJobSchema)

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack)
      throw new ExpressError(listOfErrors, 400);
      
      // return next(err)
    }

    let job = await Job.create(req.body);
    return res.json({ job })
  } catch (err) {
    return next(err)
  }
})

/** GET/jobs by search terms, should return JSON of {jobs: [job, ...]} */
router.get("/", async function (req, res, next) {
  let searchName = req.query.searchName;
  let minSalary = req.query.minSalary;
  let maxSalary = req.query.maxSalary;
  try {
    if (minSalary < maxSalary || minSalary === undefined || maxSalary === undefined || searchName === undefined) {
      let jobs = await Job.search(searchName, minSalary, maxSalary)

      if (jobs.length !== 0){
            return res.json({ jobs })
      }
      throw new ExpressError("Params are not valid", 400);
    }
          
    throw new ExpressError("Params are not valid", 400);
  } catch (err) {
    return next(err)
  }

})

/** GET/jobs/[id], return JSON of {job: jobData} */
router.get("/:id", async function (req, res, next) {

  let id = req.params.id;
  try {
    let job = await Job.get(id);

    if (job) {
      return res.json({ job })
    }
    throw new ExpressError("job Not Found", 404);


  } catch (err) {
    return next(err)
  }
})

/** PATCH/jobs/[id], update company routes by id, should return JSON of {job: jobData} */
router.patch("/:id", async function (req, res, next) {
  let id = req.params.id;
  let items = req.body.items

  try {

    let updateJob = sqlForPartialUpdate("jobs", items, "id", id)

    const validateResult = jsonschema.validate(items, patchJobSchema)
    if (!validateResult.valid) {

      let listOfErrors = validateResult.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);

    }
    const result = await db.query(updateJob.query, updateJob.values)
    if (result.rowCount !== 0) {
      let job = result.rows[0]
      return res.json({ job })
    }
    throw new ExpressError("Job Not Found", 404);

  } catch (err) {
    return next(err)
  }
})

/** DELETE/jobs/[id], return JSON of { message: "Job deleted" } */
router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    const result = await db.query(`DELETE FROM jobs WHERE id=$1`, [id])
    if (result.rowCount !== 0) {
      return res.json({ message: "Job deleted" })
    }

    throw new ExpressError("Job Not Found", 404);
  } catch (err) {
    return next(err)
  }
})


module.exports = router; 