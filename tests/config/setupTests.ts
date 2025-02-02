import dotenv from "dotenv";
import mockPrisma from "../__mocks__/prismaClient";
// ✅ Load environment variables khusus untuk testing
dotenv.config({ path: ".env.test" });

// ✅ Mock Prisma, Axios, dan Node-Cron untuk SEMUA unit test
if (process.env.NODE_ENV === "test:unit") {
  jest.mock("../../src/infrastructure/prismaClient", () => ({
    __esModule: true,
    default: mockPrisma,
  }));

  jest.mock("axios");

  jest.mock("node-cron", () => ({
    schedule: jest.fn(), // ✅ Mock node-cron agar tidak menjalankan cron asli
  }));

  beforeAll(() => {
    console.log(
      "🚀 Unit tests are running with Prisma, Axios, and Cron mocked."
    );
  });
}
