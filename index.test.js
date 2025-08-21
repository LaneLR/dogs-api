const request = require("supertest");
// express app
const app = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description:
      "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });
  });

  describe("POST /dogs", () => {
    let res;
    it("should create a new dog and return it", async () => {
      res = await request(app).post("/dogs").send(testDogData);
      expect(res.body).toEqual(expect.objectContaining(testDogData));
    });
    it("should find the data of the dog we just posted", async () => {
      const dogFromDb = await Dog.findByPk(res.body.id);
      expect(dogFromDb.dataValues).toEqual(
        expect.objectContaining(testDogData)
      );
    });
  });

  describe("Delete /dogs/:id", () => {
    it("should delete a dog with id 1 and return it", async () => {
      const res = await request(app).delete(`/dogs/1`);
      const dogFromDb = await Dog.findAll({ where: { id: 1 } });
      expect(dogFromDb).toEqual([]);
    });
  });
});
