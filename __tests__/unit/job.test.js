const db = require("../../db");
const Job = require("../../models/job");
const Company = require("../../models/company");



describe("Model", function () {
  let id = null;
  
  beforeEach(async function () {
    await db.query("DELETE FROM jobs"); 
    await db.query("DELETE FROM companies");

    await Company.create({
      handle: "testHandle",
      name: "testName",
      num_employees: 10,
      description: "This is our test",
      logo_url: "https://www.google.com/"

   
  })
    let response = await Job.create({
      title: "engineer_test1",
      salary: 100,
      equity: 0.1,
      company_handle: "testHandle"})

      id = response.id;

    
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
  })

  describe("create()", function () {

    test("should return new job object ", async function () {
      let result = await Job.create({
      title: "accountant_testCreate",
      salary: 200,
      equity: 0.5,
      company_handle: "testHandle"
      })
      expect(result.title).toEqual("accountant_testCreate");
      expect(result.salary).toEqual(200);
      expect(result.equity).toEqual(0.5);
      expect(result.company_handle).toEqual("testHandle");
    });

  });

  describe("search()", function () {

    test("should return the search's title, company_handle, salary", async function () {
      let result = await Job.search('engineer', undefined, undefined)
      expect(result[0].title).toEqual("engineer_test2");
      expect(result[1].title).toEqual("engineer_test1");

    });
    test("should return the search's title, company_handle, salary", async function () {
      let result = await Job.search(undefined, 1, 1000000000000000000)
      expect(result[0].title).toEqual("artist_test2");
      expect(result[1].title).toEqual("engineer_test2");
      expect(result[2].title).toEqual("engineer_test1");

    });

    test("should return the search's title, company_handle, salary", async function () {
      let result = await Job.search(undefined, 1, undefined)
      expect(result[0].title).toEqual("artist_test2");
      expect(result[1].title).toEqual("engineer_test2");
      expect(result[2].title).toEqual("engineer_test1");

    });

    test("should return the search's title, company_handle, salary", async function () {
      let result = await Job.search(undefined, undefined, 10000000)
      expect(result[0].title).toEqual("artist_test2");
      expect(result[1].title).toEqual("engineer_test2");
      expect(result[2].title).toEqual("engineer_test1");

    });

    test("should return the search's title, company_handle, salary", async function () {
      let result = await Job.search("sdfllsdfskdfksdf", undefined, undefined)
      expect([]);
     
    });

  })

  /**get the job by id  */
  describe("get()", function() {
    test("should return the company's object by the id", async function () {
      let result = await Job.get(id);
      expect(result.job_title).toEqual("engineer_test1");

    });    

  });

  afterAll(async function () {
    await db.end()
  })




});