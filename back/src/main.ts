import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { BaseAPIDocumentation } from "./api/base.document";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // SWagger API
  const documentOption = new BaseAPIDocumentation().initializaeOptions();
  const document = SwaggerModule.createDocument(app, documentOption);
  SwaggerModule.setup("api", app, document);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 5001;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  Logger.log(`Application running on port ${port}`);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://phoca-master.pages.dev',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
