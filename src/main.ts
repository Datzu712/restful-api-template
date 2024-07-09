import { config } from 'dotenv';

async function bootstrap() {
    config();

    console.log(process.env.NODE_ENV);
}
bootstrap();
