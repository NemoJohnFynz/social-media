import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventModule } from './event/event.module'; // Thêm module WebSocket
import { WebSocketGateway } from '@nestjs/websockets';
import { EventGeteWay } from './event/event.geteway';

import cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;

async function bootstrap() {
  // Tạo HTTP API (AppModule) trên cổng 3001
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS Example')
    .setDescription('NestJS Example API description')
    .setVersion('1.0')
    .addTag('nestjs-example')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Chạy HTTP API trên cổng 3001
  await app.listen(3001);

  // Tạo WebSocket App cho EventModule và chạy trên cổng 3002
  // const socketApp = await NestFactory.create(EventModule);  // Khởi tạo EventModule cho WebSocket
  // socketApp.useWebSocketAdapter(new WsAdapter(socketApp));  // Thiết lập WebSocket Adapter
  // await socketApp.listen(3002); // WebSocket server chạy trên cổng 3002

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
