import type { MultipartFields } from 'fastify-multipart';

declare module 'fastify' {
    interface FastifyRequest {
        incomingFile: MultipartFields;
    }
}
