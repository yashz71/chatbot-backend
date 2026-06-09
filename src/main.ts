import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { doubleCsrf } from 'csrf-csrf';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
//needs implementing csrf
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Enables req.cookies
  app.enableCors({origin: 'http://localhost:4200https://hermesaiagent-cbc4gxebbkhag0ea.francecentral-01.azurewebsites.net', // Your Angular URL
  credentials: true, // Crucial for Cookies
});
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [process.env.KAFKA_BROKER!],
      ssl: true, // Confluent requires SSL
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY!,
        password: process.env.KAFKA_API_SECRET!,
      },
      
  connectionTimeout: 10000,
  requestTimeout: 25000,
    },
    consumer: {
      groupId: 'nestjs-consumer-group', // Must be unique for your app
    },
  },
});

await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
