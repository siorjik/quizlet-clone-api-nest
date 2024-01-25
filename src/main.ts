import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { config } from 'dotenv'

import AppModule from './app.module'

config({ path: `.env.${process.env.NODE_ENV}` })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ origin: `${process.env.CLIENT_HOST}`, credentials: true })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Quizlet clone with nest.')
    .setDescription('Some description.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(8080)
}

bootstrap()
