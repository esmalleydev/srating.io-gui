

import { createDefaultPreset } from 'ts-jest';


const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} * */
export default {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,ts,tsx}', // include all source files
    'components/**/*.{js,ts,tsx}', // include all source files
    'contexts/**/*.{js,ts,tsx}', // include all source files
    'redux/**/*.{js,ts,tsx}', // include all source files
    'Surface/**/*.{js,ts,tsx}', // include all source files
    // '!**/*.d.ts', // exclude type declarations if using TS
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
