/** Test for companies */

const request = require("supertest");
const app = require("../../../app");
const db = require("../../../db");
const Company = require("../../../models/company");
const Job = require("../../../models/job");



describe("routes for jobs", async function () {
  id = null;
  date = null;
  beforeAll(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");
  
    await Company.create({
      handle: "testHandle",
      name: "testName",
      num_employees: 10,
      description: "This is our test",
      logo_url: "https://www.google.com/"


    });
    let response = await Job.create({
      title: "engineer_test1",
      salary: 100,
      equity: 0.1,
      company_handle: "testHandle"
    })



    await Job.create({
      title: "engineer_test2",
      salary: 1000,
      equity: 0.5,
      company_handle: "testHandle"
    })
    await Job.create({
      title: "artist_test2",
      salary: 10000,
      equity: 0.7,
      company_handle: "testHandle"
    })
    id = response.id;
    date = JSON.stringify(response.date_posted);
  });



  describe("GET /:id", function () {
    ;
    test("It should respond with {jobs{ [job,...]}", async function () {


      const response = await request(app).get(`/jobs/${id}`);
      expect(response.body).toEqual({
        job:
        {
          "company_name": "testName",
          "date_posted": JSON.parse(date),
          "description": "This is our test",
          "job_equity": 0.1,
          "job_id": id,
          "job_title": "engineer_test1",
          "logo_url": "https://www.google.com/",
          "num_employees": 10,
          "salary": 100
        }
      });

    })

    test("It should return 404 is job not found", async function () {
      const response = await request(app)
        .get("/companies/454");
      expect(response.statusCode).toEqual(404);

    });
  });

  describe("GET /query params", function () {


    test("It should respond with {jobs: {job details...}} testing with all search params: searchName,min_salary,max_salary ",
      async function () {
        const response = await request(app).get("/jobs?SearchName=engineer&minSalary=3&maxSalary=500");
        expect(response.body).toEqual({
          "jobs":
            [{
              "company_handle": "testHandle",
              "date_posted": JSON.parse(date),
              "salary": 100,
              "title": "engineer_test1"
            }]
        });
      })

    /**FIXME: fix the search  */

    // test("It should respond with {jobs: {job details...}}, testing t ",
    //   async function () {
    //     const response = await request(app).get("/jobs?SearchName=engineer&minSalary=3&maxSalary=500");
    //     expect(response.body).toEqual({

    //       "companies": [{
    //         "handle": "testHandle",
    //         "name": "testName",
    //       }]

    //     });
  });

  //         test("It should respond with {companies: handle and name}, testing when min > max ", async function () {
  //             const response = await request(app).get("/companies?&minEmployees=23423&maxEmployees=50");
  //             expect(response.body).toEqual({

  //                 "status": 400,
  //                 "message": "Params are not valid"

  //             });
  //         })

  //         test("It should respond with {companies: handle and name}, testing invalid searchName", async function () {
  //             const response = await request(app).get("/companies?searchName=sdfjsdlkfk&minEmployees=9&maxEmployees=50");
  //             expect(response.body).toEqual({

  //                 "status": 400,
  //                 "message": "Params are not valid"

  //             });
  //         })


  //         test("It should return 400 if params are not valid", async function () {
  //             const response = await request(app)
  //                 .get("/companies?searchName=test&minEmployees=50&maxEmployees=5/blargh");
  //             expect(response.statusCode).toEqual(400);

  //         });

  //     });


  describe("POST /", async function () {
  

    test("It should add a job", async function () {

      

    test("It should respond with {jobs: {job details...}} testing with all search params: searchName,min_salary,max_salary ",
      async function () {
        const response = await request(app).get("/jobs?SearchName=engineer&minSalary=3&maxSalary=500");
        expect(response.body).toEqual({
          "jobs":
            [{
              "company_handle": "testHandle",
              "date_posted": JSON.parse(date),
              "salary": 100,
              "title": "engineer_test1"
            }]
        });
      });
  

  test("It should respond with {jobs: {job details...}}, testing it only returns salarys between 3 and 5 ",
    async function () {
      const response = await request(app).get("/jobs?SearchName=engineer&minSalary=3&maxSalary=500");
   expect(response.body).toEqual({
     jobs:
      [ { title: 'engineer_test1',
          company_handle: 'testHandle',
          "date_posted": JSON.parse(date),
              "salary": 100,
              "title": "engineer_test1"} ] }
  );
});
  });

  
  describe("POST /", async function () {
    test("It should add a job", async function () {
      const response = await request(app)
        .post("/jobs")
        .send({
          "title": "testing app",
          "salary": 200,
          "equity": 0.4,
          "company_handle": "testHandle"
        });

  
        expect(response.statusCode).toBe(200);

    });
  });

      describe("PATCH /:handle", function () {

          test("It should update jo", async function () {
              const response = await request(app)
                  .patch("/companies/testHandle")
                  .send({ "items": { name: "testyPATCH", description: "NewDescrip" } });

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
  //         test("It should return 404 for no-such-comp", async function () {
  //             const response = await request(app)
  //                 .patch("/companies/blargh")
  //                 .send({ "items": { name: "testyPATCH", description: "NewDescrip" } });;
  //             expect(response.statusCode).toEqual(404);

  //         });
  //     });

  //     describe("DELETE /handle", function () {

  //         test("It should delete company", async function () {
  //             const response = await request(app)
  //                 .delete("/companies/testHandle");

  //             expect(response.body).toEqual({ "message": "Company deleted" });
  //         });

  //         test("It should return 404 for no-such-comp", async function () {
  //             const response = await request(app)
  //                 .delete("/companies/blargh");

  //             expect(response.statusCode).toEqual(404);
  //         });
  //     });

    test("It should return a 500 error if the company handle does not exist", async function () {
      const response = await request(app)
        .post("/jobs")
        .send({
          "title": "newValue",
          "salary": 200,
          "equity": 0.4,
          "company_handle": ""
        });
        expect(response.statusCode).toBe(500);
        
    });
  });


  afterAll(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");
    await db.end()
  })


});

