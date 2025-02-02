
import axios from "axios";
import mockPrisma from "../../__mocks__/prismaClient";
import { sendBirthdayMessage } from "../../../src/application/services/BirthdayService";
import * as BirthdayService from "../../../src/application/services/BirthdayService";

jest
  .spyOn(BirthdayService, "delay")
  .mockImplementation(() => Promise.resolve());

describe("BirthdayService - sendBirthdayMessage", () => {
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe90@example.com",
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

    expect(axios.post).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled(); 
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

  it("should retry and succeed after initial failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    let callCount = 0;
    (axios.post as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("Request failed with status code 500"));
      }
      return Promise.resolve({
        data: { status: "sent", sentTime: "2025-02-01T15:50:09.885Z" },
      });
    });
    
    (mockPrisma.user.findUnique as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ ...mockUser, retryCount: callCount - 1 });
    });
    (mockPrisma.user.update as jest.Mock).mockResolvedValue({});
    (mockPrisma.messageLog.create as jest.Mock).mockResolvedValue({});

    await BirthdayService.sendBirthdayMessage(mockUser);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: expect.objectContaining({
        messageStatus: "sent",
        retryCount: { increment: 1 },
      }),
    });

    consoleErrorSpy.mockRestore();
  }, 60000);

 it("should create message log on failure attempt", async () => {

   jest
     .spyOn(BirthdayService, "delay")
     .mockImplementation(() => Promise.resolve());

   const error = new Error("Request failed with status code 500");
   (axios.post as jest.Mock).mockRejectedValue(error);

   let currentRetry = 0;

   (mockPrisma.user.findUnique as jest.Mock).mockImplementation(() => {
     return Promise.resolve({ ...mockUser, retryCount: currentRetry });
   });
   (mockPrisma.user.update as jest.Mock).mockImplementation(() => {
     currentRetry++;
     return Promise.resolve({});
   });
   (mockPrisma.messageLog.create as jest.Mock).mockResolvedValue({});

   await sendBirthdayMessage(mockUser);


   expect(currentRetry).toBeGreaterThan(0);
   expect(mockPrisma.messageLog.create).toHaveBeenCalledWith({
     data: {
       userId: mockUser.id,
       status: "failed",
       scheduledTime: expect.any(Date),
     },
   });
 }, 60000);
});
