// tests/units/services/birthdayService.test.ts
import axios from "axios";
import mockPrisma from "../../__mocks__/prismaClient";
import { sendBirthdayMessage } from "../../../src/application/services/BirthdayService";

// Mock dependencies
jest.mock("axios");
jest.mock("../../../src/infrastructure/prismaClient", () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe("BirthdayService - sendBirthdayMessage", () => {
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    retryCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send birthday message successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { status: "sent", sentTime: "2025-02-01T15:50:09.885Z" },
    });

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.user.update as jest.Mock).mockResolvedValue({});

    await sendBirthdayMessage(mockUser);

    expect(axios.post).toHaveBeenCalledWith(
      "https://email-service.digitalenvision.com.au/send-email",
      {
        email: mockUser.email,
        message: `Hey, John Doe, it’s your birthday!`,
      },
      expect.any(Object)
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        lastBirthdaySent: new Date("2025-02-01T15:50:09.885Z"),
        messageStatus: "sent",
        retryCount: { increment: 1 },
      },
    });
  });

  it("should not retry if retryCount >= 3", async () => {
    const userWithMaxRetry = { ...mockUser, retryCount: 3 };

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(
      userWithMaxRetry
    );

    await sendBirthdayMessage(userWithMaxRetry);

    expect(axios.post).not.toHaveBeenCalled(); // Should not send message
    expect(mockPrisma.user.update).not.toHaveBeenCalled(); // Should not update
  });

  it("should stop retrying after max attempts", async () => {
    const userWithMaxRetry = { ...mockUser, retryCount: 3 };
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(
      userWithMaxRetry
    );

    await sendBirthdayMessage(userWithMaxRetry);

    expect(axios.post).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should handle invalid user", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await sendBirthdayMessage(mockUser);

    expect(axios.post).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("should handle failed request", async () => {
    (axios.post as jest.Mock).mockRejectedValue({
      response: { data: "Internal server error" },
    });

    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (mockPrisma.user.update as jest.Mock).mockResolvedValue({});

    await sendBirthdayMessage(mockUser);

    expect(axios.post).toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });
});
