module.exports = {
  transform: {
    "^.+\\.(js|ts|tsx|jsx)$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|azure-devops-ui|azure-devops-extension-sdk)/)"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
  },
  preset: "ts-jest/presets/js-with-babel",
  testResultsProcessor: "./node_modules/jest-junit-reporter",
  collectCoverage: true,
  coverageReporters: [
    "json",
    "html",
    "cobertura"
  ],
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.test.json"
    }
  }
}