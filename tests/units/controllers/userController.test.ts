import request from "supertest";
import app from "../../../src/index";
import mockPrisma from "../../__mocks__/prismaClient"

describe("UserController", () => {

  beforeAll(() => {
    process.env.NODE_ENV = "test:unit";
  });

  afterAll(() => {
    process.env.NODE_ENV = "test";
  });

  afterEach(() => jest.clearAllMocks());

  test("should create a new user", async () => {
    const mockUser = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      birthday: new Date(),
      timezone: "UTC",
      email: "john.doe@example.com",
    };


    mockPrisma.user.create.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/user")
      .send(mockUser)
      .expect(201);

    expect(response.body.data.firstName).toBe("John");
    expect(response.body.data.email).toBe("john.doe@example.com");
  });

  test("should get list of users", async () => {
    const mockUsers = [{ firstName: "Jane", lastName: "Doe" }];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);
    mockPrisma.user.count.mockResolvedValue(1);

    const response = await request(app).get("/api/users").expect(200);

    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data.list)).toBe(true);
    expect(response.body.data.list).toEqual(mockUsers);
    expect(response.body.data.pagination).toBeDefined();
  });

  test("should delete a user", async () => {
    const userId = 1;
    mockPrisma.user.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete(`/api/user/${userId}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("User deleted successfully");
  });

  test("should update a user", async () => {
    const userId = 1;
    const updateData = {
      firstName: "Jane Updated",
      lastName: "Doe Updated",
      birthday: "1991-02-03T17:30:00.123+07:00",
      timezone: "Asia/Jakarta",
      email: "jane.updated@example.com",
    };

    const updatedUser = {
      id: userId,
      ...updateData,
    };

    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const response = await request(app)
      .put(`/api/user/${userId}`)
      .send(updateData)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data).toEqual(updatedUser);
  });

  test("should handle invalid update data", async () => {
    const userId = 1;
    const invalidData = {
      firstName: "Jane Updated",
      // Missing required fields
    };

    const response = await request(app)
      .put(`/api/user/${userId}`)
      .send(invalidData)
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  test("should handle update of non-existent user", async () => {
    const userId = 999;
    const updateData = {
      firstName: "Jane Updated",
      lastName: "Doe Updated",
      birthday: "1991-02-03T17:30:00.123+07:00",
      timezone: "Asia/Jakarta",
      email: "jane.updated@example.com",
    };

    mockPrisma.user.update.mockRejectedValue(new Error("User not found"));

    const response = await request(app)
      .put(`/api/user/${userId}`)
      .send(updateData)
      .expect(500);

    expect(response.body.status).toBe("error");
  });

  test("should get a user by id", async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      firstName: "John",
      lastName: "Doe",
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const response = await request(app).get(`/api/user/${userId}`).expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data).toEqual(mockUser);
  });

  test("should handle user not found", async () => {
    const userId = 999;
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app).get(`/api/user/${userId}`).expect(404);

    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("User not found");
  });
});
