import request from "supertest";
import app from "../../src";

describe("Express App Setup", () => {
  let server: any;

  beforeAll((done) => {
    process.env.NODE_ENV = "test:unit";
    process.env.PORT = "0";

    server = app.listen(process.env.PORT, () => {
      const actualPort = server.address().port;
      console.log(`✅ Test server running on port ${actualPort}`);
      done();
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(() => {
        console.log("✅ Test server closed");
        process.env.NODE_ENV = "test";
        done();
      });
    }
  });

  test("should have json middleware", async () => {
    const response = await request(server)
      .post("/api/user")
      .send({})
      .expect("Content-Type", /json/);

    expect(response.status).toBe(400);
  });

  test("should have /api route configured and return JSON for 404", async () => {
    const response = await request(server)
      .get("/api/nonexistent")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toEqual({
      status: "error",
      code: 404,
      message: "Route not found",
    });
  });

  test("should handle errors with JSON response", async () => {
    const response = await request(server)
      .get("/api/error-test")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toEqual({
      status: "error",
      code: 404,
      message: "Route not found",
    });
  });
});
