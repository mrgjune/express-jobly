const express = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError")
//const sqlForPartialUpdate = require("../helpers/partialUpdate")
const db = require("../db")
const jsonschema = require("jsonschema");
