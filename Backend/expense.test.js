const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("./server");

test("Expense API", async (t) => {
  let expenseId;

  await t.test("should add a new expense", async () => {
    const res = await request(app)
      .post("/api/v1/expense/add")
      .send({
        icon: "🍔",
        amount: 10,
        category: "Food",
        date: new Date(),
        note: "Lunch",
      })
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, "Expense added successfully");
    expenseId = res.body.expense._id;
  });

  await t.test("should get all expenses", async () => {
    const res = await request(app)
      .get("/api/v1/expense/")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.expenses));
  });

  await t.test("should update an expense", async () => {
    const res = await request(app)
      .put(`/api/v1/expense/${expenseId}`)
      .send({
        note: "Dinner",
      })
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "Expense updated successfully");
  });

  await t.test("should delete an expense", async () => {
    const res = await request(app)
      .delete(`/api/v1/expense/${expenseId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.message, "Expense deleted successfully");
  });
});
