import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import path from 'path';

const dir = path.resolve(__dirname, '.');

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
        testMatch: ['**/?(*.)+(spec|e2e-spec).ts'],
        setupFilesAfterEnv: ['<rootDir>/test/setup-jest.ts'],
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${dir}/` }),
        testEnvironment: 'node',
        transform: {
            '^.+\\.ts?$': [
                'ts-jest',
                {
                    tsconfig: 'tsconfig.json',
                },
            ],
        },
        moduleDirectories: ['node_modules', '<rootDir>'],
        testTimeout: 60000,
    };
};