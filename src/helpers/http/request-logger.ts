import type { FastifyRequest } from 'fastify';
import { Logger } from 'useful-logger';
// import { validateEnv } from '../validations';

// const envValues = validateEnv(process.env);

export function requestLogger(request: FastifyRequest, responseTime: number): void {
    // todo: remove passwords, tokens, and other sensitive data from logs
    try {
        const requestBody = JSON.stringify(request.body)?.replaceAll(
            /"password"\s*:\s*"[a-zA-Z-]+"/g,
            '"password": "secret"',
        );
        const textLog =
            '<method> <statusCode> <url> from <ip> Request Body: <request-body>; after <response-duration>s (<REQ-ID>)'
                .replaceAll('<serviceName>', 'router')
                .replaceAll('<level>', 'info')
                .replaceAll('<response-duration>', `${responseTime}`)
                .replaceAll('<statusCode>', `${request.raw.statusCode}`)
                .replaceAll('<method>', `${request.raw.method}`)
                .replaceAll('<url>', `${request.raw.url}`)
                .replaceAll('<ip>', `${request.socket.remoteAddress}`)
                .replaceAll('<userAgent>', `${request.headers['user-agent']}`)
                .replaceAll('<request-body>', requestBody)
                .replaceAll('<REQ-ID>', request.id);

        Logger.log(textLog, 'RouterLogger');
    } catch (error) {
        (error as Error).message = `Error logging request: ${(error as Error).message}`;
        Logger.error(error, 'RequestLogger');
    }
}
