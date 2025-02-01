import { errorResponse, paginatedResponse, successResponse } from "../../../../src/shared/utils/ApiResponse"

describe("ApiResponse Utils", () => {
  test("successResponse should create correct response format", () => {
    const response = successResponse("Success message", { data: "test" }, 201);

    expect(response).toEqual({
      status: "success",
      code: 201,
      message: "Success message",
      data: { data: "test" },
    });
  });

  test("successResponse should use default code 200", () => {
    const response = successResponse("Success message");
    expect(response.code).toBe(200);
  });

  test("errorResponse should create correct error format", () => {
    const response = errorResponse("Error message", 400);

    expect(response).toEqual({
      status: "error",
      code: 400,
      message: "Error message",
      data: null,
    });
  });

  test("paginatedResponse should create correct paginated format", () => {
    const list = [{ id: 1 }, { id: 2 }];
    const pagination = {
      page: 1,
      total: 10,
      per_page: 2,
      total_page: 5,
    };

    const response = paginatedResponse("Success", list, pagination);

    expect(response).toEqual({
      status: "success",
      code: 200,
      message: "Success",
      data: {
        list,
        pagination,
      },
    });
  });
});
