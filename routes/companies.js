const express = require("express");
const router = new express.Router();
const Company = require("../models/company")
const ExpressError = require("../helpers/expressError")
const partialUpdate = require("../helpers/partialUpdate")

/**GET/companies, return  JSON of {companies: [companyData, ...]}  */
router.get("/", async function (req, res, next) {
    let searchName = req.query.searchName;
    let minEmployees = (req.query.minEmployees);
    let maxEmployees = (req.query.maxEmployees);
    try {
        if (minEmployees < maxEmployees || minEmployees === undefined || maxEmployees === undefined || searchName === undefined) {

            let companies = await Company.search(searchName, minEmployees, maxEmployees)
            return res.json({companies})
        }
        throw new ExpressError("Params are not valid",400);                                   
    } catch(err){
        return next(err)
    }
    
    
})




module.exports = router;