import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../src/presentation/middlewares/errorHandler";

describe("errorHandler middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    console.error = jest.fn(); 
  });

  test("should handle error properly", () => {
    const error = new Error("Test error");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test error",
    });
  });
});
