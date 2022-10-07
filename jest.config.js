const config = {
  verbose: true,
  setupFiles: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/test/*.ts'],
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!@bisonai)'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  maxConcurrency: 1,
  maxWorkers: 1,
  bail: true
}
module.exports = config
