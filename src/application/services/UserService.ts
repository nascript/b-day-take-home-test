import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { User } from "../../domain/models/User";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(user: User) {
    try {
      const result = await this.userRepository.createUser(user);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.userRepository.updateUser(id, user);
  }

  async getUser(id: number) {
    return this.userRepository.getUserById(id);
  }

  async listUsers(
    page: number,
    perPage: number,
    sortBy?: "createdAt" | "firstName" | "lastName",
    sortOrder?: "asc" | "desc",
    search?: string,
    timezone?: string,
    email?: string
  ) {
    return await this.userRepository.getAllUsers({
      page,
      perPage,
      sortBy,
      sortOrder,
      search,
      timezone,
      email,
    });
  }
}

export const userService = new UserService();
