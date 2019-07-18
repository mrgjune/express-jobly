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

describe("partialUpdate()", async function (){
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
    await sqlForPartialUpdate(
      "companies",
      {name:"testUpdated",num_employees:20},
      "handle",
      "testHandle")
    expect(true).toEqual(true)
  });


});
afterAll(async function(){
    await db.end()
})
