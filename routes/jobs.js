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
    }
    if (req.body.equity > 1){
      throw new ExpressError("Equity value should be less than 1", 400);
      
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

/** PATCH /[jobid]  {jobData} => {job: updatedJob} */

router.patch('/:id', async function(req, res, next) {
  try {
    if ('id' in req.body) {
      throw new ExpressError('You are not allowed to change the ID', 400);
    }

    const validation = validate(req.body, jobUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

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