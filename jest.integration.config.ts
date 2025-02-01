module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/integrations"],
  globalSetup: "./tests/config/globalSetup.integration.ts",
  globalTeardown: "./tests/config/globalTeardown.integration.ts", 
  clearMocks: true,
  resetMocks: true,
};
