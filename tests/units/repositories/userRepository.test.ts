import { UserRepository } from "../../../src/infrastructure/repositories/UserRepository";
import mockPrisma from "../../__mocks__/prismaClient";

const userRepository = new UserRepository();

describe("UserRepository", () => {
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

    const result = await userRepository.createUser(mockUser);

    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: mockUser });
    expect(result).toEqual(mockUser);
  });

  test("should get all users", async () => {
    const mockUsers = [{ firstName: "Jane", lastName: "Doe" }];
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);
    mockPrisma.user.count.mockResolvedValue(1);

    const result = await userRepository.getAllUsers({
      page: 1,
      perPage: 10,
    });

    expect(mockPrisma.user.findMany).toHaveBeenCalled();
    expect(result).toEqual({
      users: mockUsers,
      total: 1,
    });
  });
});
