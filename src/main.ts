import { Logger } from 'useful-logger';
import { getIP } from '@app/helpers';
import fastify from 'fastify';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { setupNestErrorHandler as sentrySetupNestErrorHandler } from '@sentry/nestjs';

import { AppModule } from './app.module';

const logger = new Logger('Dose', {
    logLevels: ['debug', 'error', 'warn', 'verbose', 'log'],
    folderPath: './logs',
    allowConsole: ['warn', 'error', 'log'],
    allowWriteFiles: true,
    outputTemplate: '{timestamp} - {level} {context} {message}',
    indents: {
        level: 7,
        context: 20,
    },
});

import './instrument';
async function bootstrap() {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || getIP();

    const fastifyInstance = fastify({
        logger: false,
    });
    await fastifyInstance.register(helmet, { contentSecurityPolicy: false });
    await fastifyInstance.register(fastifyCsrf);
    await fastifyInstance.register(compression);

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(fastifyInstance as never),
        {
            logger,
        },
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    sentrySetupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

    await app.listen(port, host);
    logger.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();
