module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/units"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFilesAfterEnv: ["<rootDir>/tests/config/setupTests.ts"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true, 
  coverageDirectory: "coverage/unit", 
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/index.ts", 
  ],
};
