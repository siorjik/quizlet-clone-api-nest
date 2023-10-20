import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Nest testing')
    .setDescription('Some description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(8080)
}

bootstrap()
