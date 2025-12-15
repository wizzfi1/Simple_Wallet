import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * This is the first function that runs when the app starts.
 * Think of it as the "engine start" of the backend.
 */
async function bootstrap() {
  // Create the NestJS application using the root AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Global validation pipe:
   * - Automatically validates all incoming request bodies
   * - Rejects invalid data before it reaches controllers/services
   * - whitelist: true removes any extra fields sent by the client
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Start the HTTP server on port 3000
  await app.listen(3000);
}

bootstrap();
