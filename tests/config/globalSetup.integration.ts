const { execSync } = require("child_process");
import "../../src/infrastructure/prismaClient";

module.exports = async () => {
  console.log("🔄 Setting up test database...");

  if (process.env.NODE_ENV === "test:integration") {
    process.env.DATABASE_URL =
      "postgresql://nascript:root@localhost:5432/birthdaydb_test";

    console.log("✅ Using Test Database:", process.env.DATABASE_URL);

    try {
      execSync("npx prisma db push --force-reset", { stdio: "inherit" });
      console.log("✅ Database ready for integration tests");
    } catch (error) {
      console.error("❌ Database setup failed:", error);
      process.exit(1);
    }
  } else {
    console.log("⚠️ Skipping database setup (not integration test)");
  }
};
