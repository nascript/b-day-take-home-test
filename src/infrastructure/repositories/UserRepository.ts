// @ts-ignore
import { User as PrismaUser, Prisma } from "@prisma/client";
import { User } from "../../domain/models/User";
import prisma from "../prismaClient";

interface GetUsersOptions {
  page: number;
  perPage: number;
  sortBy?: "createdAt" | "firstName" | "lastName";
  sortOrder?: "asc" | "desc";
  search?: string;
  timezone?: string;
  email?: string;
}

export class UserRepository {
  async createUser(user: User): Promise<PrismaUser> {
    try {
      const result = await prisma.user.create({ data: user });

      return result;
    } catch (error) {
      console.error("Service create user error:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async updateUser(id: number, user: Partial<User>): Promise<PrismaUser> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async getUserById(id: number): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers(
    options: GetUsersOptions
  ): Promise<{ users: PrismaUser[]; total: number }> {
    const {
      page = 1,
      perPage = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      search,
      timezone,
      email,
    } = options;

    const whereClause = {
      AND: [
        search
          ? {
              OR: [
                {
                  firstName: {
                    contains: search,
                    // @ts-ignore
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  lastName: {
                    contains: search,
                    // @ts-ignore
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
        timezone ? { timezone: { equals: timezone } } : {},
        email ? { email: { equals: email } } : {},
      ],
    };

    const total = await prisma.user.count({ where: whereClause });

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return { users, total };
  }
}
