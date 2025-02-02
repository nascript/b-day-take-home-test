import dotenv from "dotenv";
import mockPrisma from "../__mocks__/prismaClient";
//
dotenv.config({ path: ".env.test" });

if (
  process.env.NODE_ENV === "test:unit" ||
  process.env.NODE_ENV === "test:file"
) {
  jest.mock("../../src/infrastructure/prismaClient", () => ({
    __esModule: true,
    default: mockPrisma,
  }));

  jest.mock("axios");

  jest.mock("node-cron", () => ({
    schedule: jest.fn(),
  }));

  beforeAll(() => {
    console.log(
      "🚀 Unit tests are running with Prisma, Axios, and Cron mocked."
    );
  });
}
