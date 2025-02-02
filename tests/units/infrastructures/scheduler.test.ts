import cron from "node-cron";
import moment from "moment-timezone";
import mockPrisma from "../../__mocks__/prismaClient";
import { sendBirthdayMessage } from "../../../src/application/services/BirthdayService";

// Mock dependencies
jest.mock("../../../src/infrastructure/prismaClient", () => mockPrisma);
jest.mock("../../../src/application/services/BirthdayService", () => ({
  sendBirthdayMessage: jest.fn(),
}));

jest.mock("node-cron", () => ({
  schedule: jest.fn((cronExpression, callback) => callback()), // ✅ Langsung jalankan callback saat di-mock
}));

describe("Scheduler", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not send message if it's not 9 AM", async () => {
    const mockUser = {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      birthday: moment().format(),
      timezone: "Asia/Jakarta",
      email: "jane.smith@example.com",
      messageStatus: "pending",
      lastBirthdaySent: null,
    };

    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

    jest.setSystemTime(
      moment.tz("2025-02-01 08:00:00", "Asia/Jakarta").toDate()
    );

    require("../../../src/infrastructure/scheduler");

    jest.advanceTimersByTime(60 * 1000); // 1 menit

    expect(sendBirthdayMessage).not.toHaveBeenCalled();
  });

  it("should not send duplicate messages", async () => {
    const mockUser = {
      id: 3,
      firstName: "Alice",
      lastName: "Brown",
      birthday: moment().format(),
      timezone: "Asia/Jakarta",
      email: "alice.brown@example.com",
      messageStatus: "pending",
      lastBirthdaySent: moment().toDate(), // Sudah pernah dikirim
    };

    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

    jest.setSystemTime(
      moment.tz("2025-02-01 09:00:00", "Asia/Jakarta").toDate()
    );

    require("../../../src/infrastructure/scheduler");

    jest.advanceTimersByTime(60 * 1000); // 1 menit

    expect(sendBirthdayMessage).not.toHaveBeenCalled();
  });

});
