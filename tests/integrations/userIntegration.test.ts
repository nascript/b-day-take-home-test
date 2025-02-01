import prisma from "../../src/infrastructure/prismaClient";
import { UserService } from "../../src/application/services/UserService";

let userId: number;

beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    const result = await prisma.$queryRaw<
      { connected: number }[]
    >`SELECT 1 as connected`;
    console.log("Database connection test:", result[0].connected === 1);
  } catch (error) {
    console.log("❌ Database connection failed:", error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await prisma.user.deleteMany();
    console.log("✅ Database cleared");

    const user = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "User",
        birthday: new Date(),
        timezone: "UTC",
        email: "test@example.com",
      },
    });
    console.log("✅ Test user created:", user);
    if (user) {
      userId = user.id;
    } else {
      console.error("❌ User creation returned undefined");
    }
  } catch (error) {
    console.error("❌ Test setup failed:", error);
    throw error;
  }
});

describe("Integration Test: User API", () => {
  it("POST /api/user - Create User", async () => {
    const userService = new UserService();
    const user = await userService.createUser({
      firstName: "John",
      lastName: "Doe",
      birthday: new Date(),
      timezone: "UTC",
      email: "john.doe@example.com",
    });

    expect(user).toHaveProperty("id");
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
  });

  it("GET /api/users - List Users", async () => {
    const userService = new UserService();
    const users = await userService.listUsers(1, 10);

    expect(users).toHaveProperty("users");
    expect(users.users.length).toBeGreaterThan(0);
  });

  it("GET /api/user/:id - Get User by ID", async () => {
    const userService = new UserService();
    const user = await userService.getUser(userId);

    expect(user).not.toBeNull();
    if (user) {
      expect(user.id).toBe(userId);
    }
  });

  it("PUT /api/user/:id - Update User", async () => {
    const userService = new UserService();
    const updatedUser = await userService.updateUser(userId, {
      firstName: "Updated",
      lastName: "User",
    });

    expect(updatedUser).toHaveProperty("id");
    expect(updatedUser.firstName).toBe("Updated");
    expect(updatedUser.lastName).toBe("User");
  });

  it("DELETE /api/user/:id - Delete User", async () => {
    const userService = new UserService();
    await userService.deleteUser(userId);

    const user = await userService.getUser(userId);
    expect(user).toBeNull();
  });
});
