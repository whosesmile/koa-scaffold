module.exports = {
  globals: { 'ts-jest': { tsConfigFile: 'tsconfig.json' } },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx,mjs,json}',
  ],
};
