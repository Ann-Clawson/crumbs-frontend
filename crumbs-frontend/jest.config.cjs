module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  testEnvironment: "jest-environment-jsdom", // No need to change this line
  moduleDirectories: ["node_modules", "src"],
};
