import moment from "moment-timezone";
import mockPrisma from "../../__mocks__/prismaClient";
import { sendBirthdayMessage } from "../../../src/application/services/BirthdayService";
import * as BirthdayService from "../../../src/application/services/BirthdayService";

let capturedCronCallback: (() => Promise<void>) | null = null;

jest.mock("../../../src/infrastructure/prismaClient", () => mockPrisma);
jest.mock("../../../src/application/services/BirthdayService", () => ({
  sendBirthdayMessage: jest.fn(),
  delay: jest.fn(),
}));
jest.mock("node-cron", () => ({
  schedule: (expression: string, callback: () => Promise<void>) => {
    capturedCronCallback = callback;
    return { start: jest.fn(), stop: jest.fn() };
  },
}));

describe("Scheduler", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    capturedCronCallback = null;
    jest
      .spyOn(BirthdayService, "delay")
      .mockImplementation(() => Promise.resolve());

    (BirthdayService.delay as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
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

    jest.advanceTimersByTime(60 * 1000);

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
      lastBirthdaySent: moment().toDate(),
    };

    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

    jest.setSystemTime(
      moment.tz("2025-02-01 09:00:00", "Asia/Jakarta").toDate()
    );

    require("../../../src/infrastructure/scheduler");

    jest.advanceTimersByTime(60 * 1000);

    expect(sendBirthdayMessage).not.toHaveBeenCalled();
  });

  it("should log error when prisma.findMany fails", async () => {
    const errorMessage = "Database error";
    (mockPrisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-01T09:00:00+07:00"));

    require("../../../src/infrastructure/scheduler");
    if (capturedCronCallback) {
      await capturedCronCallback();
    }
    await Promise.resolve();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "❌ Error in scheduler:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  it("should not send any messages if no pending users", async () => {
    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);

    jest.useFakeTimers();

    jest.setSystemTime(new Date("2025-02-01T09:00:00+07:00"));

    require("../../../src/infrastructure/scheduler");
    if (capturedCronCallback) {
      await capturedCronCallback();
    }
    await Promise.resolve();

    expect(sendBirthdayMessage).not.toHaveBeenCalled();
  });

  it("should log the check message when scheduler runs", async () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    (mockPrisma.user.findMany as jest.Mock).mockResolvedValue([]);

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-01T10:00:00+07:00"));

    require("../../../src/infrastructure/scheduler");
    if (capturedCronCallback) {
      await capturedCronCallback();
    }
    await Promise.resolve();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "🎯 Checking for birthdays & retries..."
    );
    consoleLogSpy.mockRestore();
  });
});
