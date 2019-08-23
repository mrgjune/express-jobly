const express = require("express");
const router = new express.Router();
const User = require("../models/user")
const ExpressError = require("../helpers/expressError")
const sqlForPartialUpdate = require("../helpers/partialUpdate")
const db = require("../db")
const jsonschema = require("jsonschema");
const postUserSchema = require("../schemas/postUserSchema")
// const patchUserSchema = require("../schemas/patchUserSchema")


/** POST/Users, return JSON of {user: userData} */
router.post("/", async function (req, res, next) {

    try {
        const result = jsonschema.validate(req.body, postUserSchema)

        if (!result.valid) {
            let listOfErrors = result.errors.map(error => error.stack)
            throw new ExpressError(listOfErrors, 400);
        }

        let user = await User.create(req.body);
        return res.json({ user })

    } catch (err) {
        return next(err)
    }
})

/** GET/users */
router.get("/", async function (req, res, next) {

    try {

        let users = await User.getAll();
        return res.json({ users })

    } catch (err) {
        return next(err)
    }

})

/** GET/users/[userame], return JSON of {user: user details} */
router.get("/:username", async function (req, res, next) {

    let username = req.params.username;
    try {
        let user = await User.get(username);

        if (user) {
            return res.json({ user })
        }
        
        throw new ExpressError("User Not Found", 404);
        

    } catch (err) {
        return next(err)
    }
})

/** PATCH/users/[username], update a user by finding with usernaem,
 * should return JSON of {user: {username, first_name, last_name, email, photo_url}} */
router.patch("/:username", async function (req, res, next) {
    try {
        if ('username' in req.body) {
            throw new ExpressError(
                'You are not allowed to change username or is_admin properties.',
                400);
        }

       

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** DELETE/users/[username], return JSON of { message: "User deleted" } */
router.delete("/:username", async function (req, res, next) {
    let username = req.params.username;
    try {
        const result = await db.query(`DELETE FROM users WHERE username=$1`, [username])
        if (result.rowCount !== 0) {
            return res.json({ message: "User deleted" })
        }

        throw new ExpressError("User Not Found", 404);
    } catch (err) {
        return next(err)
    }
})


module.exports = router; 