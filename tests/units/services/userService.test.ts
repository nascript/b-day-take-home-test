import { UserService } from "../../../src/application/services/UserService";
import mockPrisma from "../../__mocks__/prismaClient";

const userService = new UserService();

describe("UserService", () => {
  afterEach(() => jest.clearAllMocks());

  test("should create a user", async () => {
    const mockUser = {
      firstName: "John",
      lastName: "Doe",
      birthday: new Date(),
      timezone: "Asia/Jakarta",
      email: "john.doe@example.com",
    };

    mockPrisma.user.create.mockResolvedValue(mockUser);

    const result = await userService.createUser(mockUser);

    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: mockUser });
    expect(result).toEqual(mockUser);
  });

  test("should list users", async () => {
    const mockUsers = [{ firstName: "Jane", lastName: "Doe" }];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const result = await userService.listUsers(1, 10);

    expect(mockPrisma.user.findMany).toHaveBeenCalled();
    expect(result.users).toEqual(mockUsers);
  });

  test("should delete a user", async () => {
    const userId = 1;
    mockPrisma.user.delete.mockResolvedValue(undefined);

    await userService.deleteUser(userId);

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  test("should update a user", async () => {
    const userId = 1;
    const updateData = {
      firstName: "Jane Updated",
      lastName: "Doe Updated",
    };
    const updatedUser = { id: userId, ...updateData };

    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await userService.updateUser(userId, updateData);

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: updateData,
    });
    expect(result).toEqual(updatedUser);
  });

  test("should get a user by id", async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      firstName: "John",
      lastName: "Doe",
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await userService.getUser(userId);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual(mockUser);
  });
});
