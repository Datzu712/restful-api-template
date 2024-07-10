import { Logger } from 'useful-logger';
import { getIP } from '@app/helpers';
import fastify from 'fastify';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { BaseExceptionFilter, HttpAdapterHost, NestFactory } from '@nestjs/core';
import { setupNestErrorHandler as sentrySetupNestErrorHandler } from '@sentry/nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { requestLogger } from '@app/helpers';

import { AppModule } from './modules/app.module';

const logger = new Logger('Dose', {
    logLevels: ['debug', 'error', 'warn', 'verbose', 'log'],
    folderPath: './logs',
    allowConsole: ['warn', 'error', 'log', 'debug'],
    allowWriteFiles: true,
    outputTemplate: '{timestamp} - {level} {context} {message}',
    indents: {
        level: 7,
        context: 20,
    },
});

import './instrument';
async function bootstrap() {
    const port = process.env.PORT || 8080;
    const host = process.env.HOST || getIP();

    const fastifyInstance = fastify({
        logger: false,
    });
    await fastifyInstance.register(helmet, { contentSecurityPolicy: false });
    await fastifyInstance.register(fastifyCsrf);
    await fastifyInstance.register(compression);

    fastifyInstance.addHook('onResponse', (request, reply, done) => {
        request.raw.statusCode = reply.statusCode;
        requestLogger(request, Math.floor(reply.elapsedTime / 1000));
        done();
    });
    fastifyInstance.addHook('onSend', async (request, _reply, payload) => {
        Logger.debug(`${payload} (${request.id})`, 'FastifyOnSend');
    });
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(fastifyInstance as never),
        {
            logger,
        },
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    sentrySetupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

    const config = new DocumentBuilder()
        .setTitle('RESTful API template with NestJS & Fastify')
        .setDescription('Amazing description')
        .setVersion('1.0')
        .addTag('api')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port, host);
    logger.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();
