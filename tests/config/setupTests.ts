import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

if (process.env.NODE_ENV === "test:unit") {
  const mockPrisma = require("../__mocks__/prismaClient").default;

  jest.mock("../../src/infrastructure/prismaClient", () => ({
    __esModule: true,
    default: mockPrisma,
  }));
}
