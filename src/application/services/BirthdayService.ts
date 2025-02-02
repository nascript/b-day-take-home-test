import axios from "axios";
import prisma from "../../infrastructure/prismaClient";


export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendBirthdayMessage = async (user: any) => {
  const maxRetries = 3;

  
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!userRecord) return;

  
  if (userRecord.retryCount >= maxRetries) {
    console.log(`⚠️ Max retries reached for ${user.email}`);
    return;
  }

  try {
    const message = `Hey, ${user.firstName} ${user.lastName}, it’s your birthday!`;

    const payload = {
      email: user.email,
      message: message,
    };

    console.log(
      `📤 Sending to ${user.email}, Retry #${userRecord.retryCount + 1}`
    );

    const response = await axios.post(
      "https://email-service.digitalenvision.com.au/send-email",
      payload,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log(`✅ Birthday message sent to ${user.email}:`, response.data);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastBirthdaySent: new Date(response.data.sentTime),
        messageStatus: "sent",
        retryCount: { increment: 1 },
      },
    });
  } catch (error: any) {
    console.error(
      `❌ Failed to send to ${user.email}:`,
      error.response?.data || error.message
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        messageStatus: "failed",
        retryCount: { increment: 1 },
      },
    });

    await prisma.messageLog.create({
      data: {
        userId: user.id,
        status: "failed",
        scheduledTime: new Date(),
      },
    });

    const waitTime = Math.pow(2, userRecord.retryCount + 1) * 1000;
    console.log(`⏳ Retrying after ${waitTime / 1000} seconds...`);

    if (userRecord.retryCount + 1 < maxRetries) {
      await delay(waitTime);
      await sendBirthdayMessage(user); 
    }
  }
};
