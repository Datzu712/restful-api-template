export interface IEnviromentVariables {
    NODE_ENV: 'development' | 'production';
    PORT: number;
    HOST: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnviromentVariables {}
    }
}