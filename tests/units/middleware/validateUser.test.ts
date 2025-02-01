import { Request, Response, NextFunction } from "express";
import { validateUser } from "../../../src/presentation/middlewares/validateUser";

describe("validateUser middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: {
        firstName: "John",
        lastName: "Doe",
        birthday: "1991-02-03T17:30:00.123+07:00",
        timezone: "Asia/Jakarta",
        email: "john.doe@example.com",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should pass validation with valid data", () => {
    validateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  test("should fail when required fields are missing", () => {
    mockRequest.body = {
      firstName: "John",
    };

    validateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message:
        "All fields (firstName, lastName, birthday, timezone, email) are required.",
    });
  });

  test("should fail with invalid email format", () => {
    mockRequest.body = {
      ...mockRequest.body,
      email: "invalid-email",
    };

    validateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid email format.",
    });
  });

  test("should fail with invalid birthday format", () => {
    mockRequest.body = {
      ...mockRequest.body,
      birthday: "invalid-date",
    };

    validateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message:
        "Invalid birthday format. Use ISO 8601 format with timezone (e.g., 1991-02-03T17:30:00.123+07:00).",
    });
  });
});
