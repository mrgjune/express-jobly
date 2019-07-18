/** Test for companies */

const request = require("supertest");
const app = require("../../../app");
const db = require("../../../db");
const Company = require("../../../models/company");

describe("routes", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM companies");
        await Company.create({
            handle: "testHandle",
            name: "testName",
            num_employees: 10,
            description: "This is our test",
            logo_url: "https://www.google.com/"
        })
    });

    describe("GET /:handle", function () {

        test("It should respond with {company: companyData} ", async function () {
            const response = await request(app).get("/companies/testHandle");
            expect(response.body).toEqual({

                "company": {
                    "handle": "testHandle",
                    "name": "testName",
                    "num_employees": 10,
                    "description": "This is our test",
                    "logo_url": "https://www.google.com/"
                }

            });
        })

        test("It should return 404 for no-such-comp", async function () {
            const response = await request(app)
                .get("/companies/blargh");
            console.log(response.statusCode);
            expect(response.statusCode).toEqual(404);

    });
});

    describe("GET /query params", function () {

        test("It should respond with {companies: handle and name} ", async function () {
            const response = await request(app).get("/companies?SearchName=test&minEmployees=3&maxEmployees=50");
            expect(response.body).toEqual({

                "companies": [{
                    "handle": "testHandle",
                    "name": "testName",
                }]

            });
        })

        test("It should return 400 if params are not valid", async function () {
            const response = await request(app)
                .get("/companies?searchName=test&minEmployees=50&maxEmployees=5/blargh");
            console.log("HERE RESPONSE", response.statusCode);
            expect(response.statusCode).toEqual(400);

    });

    });

    describe("POST /", function () {

        test("It should add company", async function () {
            const response = await request(app)
                .post("/companies")
                .send({
                    "handle": "addCompany",
                    "name": "added",
                    "num_employees": 100,
                    "description": "This is our added test",
                    "logo_url": "https://www.google.com/"
                });

            expect(response.body).toEqual(
                {
                    "companies": {
                        "handle": "addCompany",
                        "name": "added",
                        "num_employees": 100,
                        "description": "This is our added test",
                        "logo_url": "https://www.google.com/"
                    }
                }
            );
        });
    });

    describe("PATCH /:handle", function () {

        test("It should update company", async function () {
            const response = await request(app)
                .patch("/companies/testHandle")
                .send({ "items": { name: "testyPATCH", description: "NewDescrip" } });
            console.log(response.status)
            expect(response.body).toEqual(
                {
                    "company": {
                        "handle": "testHandle",
                        "name": "testyPATCH",
                        "num_employees": 10,
                        "description": "NewDescrip",
                        "logo_url": "https://www.google.com/"
                    }
                }

            );
        });
        test("It should return 404 for no-such-comp", async function () {
            const response = await request(app)
                .patch("/companies/blargh")
                .send({ "items": { name: "testyPATCH", description: "NewDescrip" } });;
            expect(response.statusCode).toEqual(404);

        });
    });

    describe("DELETE /handle", function () {

        test("It should delete company", async function () {
            const response = await request(app)
                .delete("/companies/testHandle");

            expect(response.body).toEqual({ "message": "Company deleted" });
        });

        test("It should return 404 for no-such-comp", async function () {
            const response = await request(app)
                .delete("/companies/blargh");
            
            expect(response.statusCode).toEqual(404);
        });
    });



    afterAll(async function () {
        await db.end()
    })

});
