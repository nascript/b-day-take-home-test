const { execSync } = require("child_process");

module.exports = async () => {
  console.log("🗑️ Cleaning up test database...");

  try {
    execSync("npx prisma migrate reset --force --skip-seed", {
      stdio: "inherit",
    });
    console.log("✅ Test database cleaned up");
  } catch (error) {
    console.error("Teardown failed:", error);
  }
};
