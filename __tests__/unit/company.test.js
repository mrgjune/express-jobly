const db = require("../../db");
const Company = require("../../models/company");
// const sqlForPartialUpdate = require("../../helpers/partialUpdate")

describe("search", async function (){
  beforeEach(async function(){
    await db.query("DELETE FROM companies");
   let c=  await Company.create({
      handle: "testHandle",
      name: "testName",
      num_employees: 10,
      description: "This is our test",
      logo_url: "https://www.google.com/"
    })
    console.log(c)
  })
  test("should return the search company name and handle ", async function() {
    let result = await Company.search('test')
    console.log(result)
    expect(result).toEqual({"handle":"testHandle","name":"testName"})
  });

  test("should return the company name and hadler which employee number greatre than number passed in", 
  async function() {
    let result = await Company.search(2);
    expect(result).toEqual({"handle":"testHandle","name":"testName"})
  });
  
  test("should return the company name and hadler which employee number less than number passed in", 
  async function() {
    let result = await Company.search(40);
    expect(result).toEqual({"handle":"testHandle","name":"testName"})
  });




  afterAll(async function(){
    await db.end()
})
});


