import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = `/api/users`;

describe("GET api/users", () => {
  let createdUserId = "";

  test("GET api/users request (an empty array is expected)", async () => {
    const response = await request(app).get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("POST api/users request (a response containing newly created record is expected)", async () => {
    const newUser = {
      username: "testuser",
      age: 25,
      hobbies: ["reading", "coding"],
    };
    const response = await request(app).post(BASE_URL).send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);

    createdUserId = response.body.id;
  });

  test("GET api/user/:id request, we try to get the created record by its id (the created record is expected)", async () => {
    const response = await request(app).get(`${BASE_URL}/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
  });

  test("PUT api/users/:id request (a response is expected containing an updated object with the same id)", async () => {
    const updatedUser = {
      username: "updateduser",
      age: 30,
      hobbies: ["painting", "cooking"],
    };
    const response = await request(app)
      .put(`${BASE_URL}/${createdUserId}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.age).toBe(updatedUser.age);
    expect(response.body.hobbies).toEqual(updatedUser.hobbies);
  });

  test("DELETE api/users/:id request, we delete the created object by id (confirmation of successful deletion is expected)", async () => {
    const response = await request(app).delete(`${BASE_URL}/${createdUserId}`);
    expect(response.status).toBe(204);
  });

  test("GET api/users/:id request, we are trying to get a deleted object by id", async () => {
    const response = await request(app).get(`${BASE_URL}/${createdUserId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });
});
