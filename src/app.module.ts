import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import globalConfig, { STATIC_DIR } from './config/global.config';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middlewares/log-incoming-request.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageProcessingModule } from './modules/image-processing/image-processing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env',
      load: [globalConfig],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(STATIC_DIR),
      serveRoot: '/static',
    }),
    LoggerModule,
    ImageProcessingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
