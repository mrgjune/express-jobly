const db = require("../../db");
const Company = require("../../models/company");
// const sqlForPartialUpdate = require("../../helpers/partialUpdate")

describe("Model", function (){
  beforeEach(async function(){
    await db.query("DELETE FROM companies");
    await Company.create({
      handle: "testHandle",
      name: "testName",
      num_employees: 10,
      description: "This is our test",
      logo_url: "https://www.google.com/"
    })
    
  })
  describe("create()", function(){
 
    test("should return new company object ", async function() {
      let result = await Company.create({
        handle: "testCreate",
        name: "create",
        num_employees: 10,
        description: "This is our test",
        logo_url: "https://www.google.com/"
      })
      expect(result).toEqual({"description": "This is our test", "handle": "testCreate", "logo_url": "https://www.google.com/", "name": "create", "num_employees": 10})
    });
  });

  describe("search()", function(){
 
  test("should return the search company name and handle ", async function() {
    let result = await Company.search('test',undefined,undefined)
    expect(result).toEqual([{"handle":"testHandle","name":"testName"}])
  });

  test("should return the company name and hadler which employee number greater than number passed in", 
  async function() {
    let result = await Company.search(undefined,2,undefined);
    expect(result).toEqual([{"handle":"testHandle","name":"testName"}])
  });
  
  test("should return the company name and hadler which employee number less than number passed in", 
  async function() {
    let result = await Company.search(undefined,undefined,40);
    expect(result).toEqual([{"handle":"testHandle","name":"testName"}])
  });

  test("should return empty array when min > max", 
  async function() {
    let result = await Company.search(undefined,5000,40);
    expect(result).toEqual([])
  });

  test("should return empty array when invalid searchTerm", 
  async function() {
    let result = await Company.search("sdfld",1,40);
    expect(result).toEqual([])
  });

})

describe("get()", function(){
  test("should return company details when handle is valid", 
  async function() {
    let result = await Company.get("testHandle");
    expect(result).toEqual({"description": "This is our test", "handle": "testHandle", "logo_url": "https://www.google.com/", "name": "testName", "num_employees": 10})
  });

  test("should return company details", 
  async function() {
    let result = await Company.get("invalid");
    expect(result).toEqual(undefined)
  });
})

  afterAll(async function(){
    await db.end()
})
});


