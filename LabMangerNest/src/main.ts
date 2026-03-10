import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cluster from 'cluster';
import * as os from 'os';

const worker_number = 2; // 或者使用 os.cpus().length

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter()
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    app.enableCors();

    await app.listen(8000, '0.0.0.0');
    console.log(`Worker ${process.pid} started on: ${await app.getUrl()}`);
}

if (cluster.isPrimary&&process.env.NODE_ENV=='production') {
    console.log('生产环境，启动集群模式');
    console.log(`Primary ${process.pid} is running`);
    // Fork workers
    for (let i = 0; i < worker_number; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    bootstrap();
}