import { Request, Response, NextFunction } from "express";
import { UserService } from "../../application/services/UserService";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../../shared/utils/ApiResponse";

const userService = new UserService();

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json(successResponse("User created successfully", user));
    } catch (error) {
      console.error("Controller create user error:", error);
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUser(Number(req.params.id));
      if (!user) {
        res.status(404).json(errorResponse("User not found", 404));
        return;
      }
      res
        .status(200)
        .json(successResponse("User retrieved successfully", user));
    } catch (error) {
      res.status(500).json(errorResponse("Failed to retrieve user"));
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await userService.updateUser(
        Number(req.params.id),
        req.body
      );
      res
        .status(200)
        .json(successResponse("User updated successfully", updatedUser));
      return;
    } catch (error) {
      res.status(500).json(errorResponse("Failed to update user"));
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(Number(req.params.id));
      res.status(200).json(successResponse("User deleted successfully"));
      return;
    } catch (error) {
      res.status(500).json(errorResponse("Failed to delete user"));
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.perPage) || 10;
      const sortBy =
        (req.query.sortBy as "createdAt" | "firstName" | "lastName") ||
        "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";
      const search = req.query.search as string;
      const timezone = req.query.timezone as string;
      const email = req.query.email as string;

      const { users, total } = await userService.listUsers(
        page,
        perPage,
        sortBy,
        sortOrder,
        search,
        timezone,
        email
      );

      const pagination = {
        page,
        per_page: perPage,
        total,
        total_page: Math.ceil(total / perPage),
      };

      res
        .status(200)
        .json(
          paginatedResponse("Users retrieved successfully", users, pagination)
        );
    } catch (error) {
      res.status(500).json(errorResponse("Failed to retrieve users"));
    }
  }
}
