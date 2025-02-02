import cron from "node-cron";
import moment from "moment-timezone";
import prisma from "./prismaClient";
import { sendBirthdayMessage } from "../application/services/BirthdayService";


cron.schedule("* * * * *", async () => {
  const nowUTC = moment.utc();
  console.log("🎯 Checking for birthdays & retries...");

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { messageStatus: "pending" },
          { messageStatus: "failed", retryCount: { lt: 3 } },
        ],
      },
    });

    for (const user of users) {
      const userLocalTime = moment.tz(nowUTC, user.timezone);
      const birthday = moment.tz(user.birthday, user.timezone);

      const isBirthdayToday =
        userLocalTime.date() === birthday.date() &&
        userLocalTime.month() === birthday.month();
      const is9AM = userLocalTime.hour() === 9 && userLocalTime.minute() === 0;

      if (
        (isBirthdayToday &&
          is9AM &&
          user.messageStatus === "pending" &&
          !user.lastBirthdaySent) ||
        (user.messageStatus === "failed" && user.retryCount < 3)
      ) {
        console.log(`🚀 Processing user: ${user.email}`);
        await sendBirthdayMessage(user);
      }
    }
  } catch (error) {
    console.error("❌ Error in scheduler:", error);
  }
});
