import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

export function swaggerBootstrap(app: INestApplication<any>, proxy?: string) {
  const config = new DocumentBuilder()
    .setTitle('Sharp Test API documentation')
    .setDescription('Sharp Test API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: 0, // чтобы модели по умолчанию не были раскрыты
      docExpansion: 'none', // чтобы операции были свернуты по умолчанию
    },
  };

  const swaggerPath = proxy ? `/swagger` : '/swagger';
  SwaggerModule.setup(swaggerPath, app, document, swaggerOptions);

  return document;
}
