import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { CustomLoggerService } from '@/logger/custom-logger.service';
import { BlurService } from './blur.service';
import { MergeService } from './merge.service';
import { SplitService } from './split.service';
import { ConfigService } from '@nestjs/config';
import { IMAGES_DIR } from '@/config/global.config';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly logger: CustomLoggerService, private readonly configService: ConfigService, private readonly blurService: BlurService, private readonly splitService: SplitService, private readonly mergeService: MergeService) {
    if (!fs.existsSync(this.configService.get(IMAGES_DIR))) {
      fs.mkdirSync(this.configService.get(IMAGES_DIR), { recursive: true });
    }
    this.logger.setContext('ImageProcessingService')
  }

  async processImage(imageBuffer: Buffer): Promise<Buffer> {
    this.logger.log('Изображение загружено.')
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    let { width, height } = metadata;
    width = Math.floor(width)
    height = Math.floor(height)

    if (!width || !height) {
      throw new Error('Не удалось получить размеры изображения');
    }

    this.logger.log('Размеры изображения получены.')

    await this.splitService.splitImage(image, width, height)

    await this.blurService.blurEdges(1)
    await this.blurService.blurEdges(2)
    await this.blurService.blurEdges(3)
    await this.blurService.blurEdges(4)

    const merged = await this.mergeService.mergeImages()
    this.logger.log('Изображение объединено.')
    return merged
  }
}