// describe("partialUpdate()", () => {
//   it("should generate a proper partial update query with just 1 field",
//       function () {

//     // FIXME: write real tests!
//     expect(false).toEqual(true);

//   });
// });
const db = require("../../db");
const Company = require("../../models/company");
const sqlForPartialUpdate = require("../../helpers/partialUpdate")

describe("partialUpdate()", function (){
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

  test("should generate a proper partial update query with just 1 field ", async function() {
    let result = await sqlForPartialUpdate(
      "companies",
      {name:"testUpdated",num_employees:20},
      "handle",
      "testHandle")
    console.log("RESULT:", result)
    let expectResult = { query:
      'UPDATE companies SET name=$1, num_employees=$2 WHERE handle=$3 RETURNING *',
     values: [ 'testUpdated', 20, 'testHandle' ] }
    console.log("EXPECTED:", expectResult)
    expect(result).toEqual(expectResult)
  });


  afterAll(async function(){
    await db.end()
})
});

//for route test patch
// {
//   "company": {
//     "handle": "testHandle",
//     "name": "testUpdated",
//     "num_employees": 20,
//     "description": "This is our test",
//     "logo_url": "https://www.google.com/"
//   }
// }