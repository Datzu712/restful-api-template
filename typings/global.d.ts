export interface IEnviromentVariables {
    NODE_ENV: 'development' | 'production';
    PORT: number;
    HOST: string;
    SENTRY_DSN: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnviromentVariables {}
    }
}
