import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { CustomLoggerService } from '@/logger/custom-logger.service';
import { ConfigService } from '@nestjs/config';
import { BLUR_STRENGTH, IMAGES_DIR } from '@/config/global.config';

@Injectable()
export class BlurService {
  private readonly blurSize = 20;
  constructor(private readonly logger: CustomLoggerService, private readonly configService: ConfigService) {
    this.logger.setContext('BlurService')
  }

  async blurEdges(partNumber: number): Promise<string> {
    if (partNumber < 1 || partNumber > 4) {
      throw new Error('partNumber должен быть от 1 до 4');
    }

    const imagePath = path.join(this.configService.get(IMAGES_DIR), `${partNumber}.png`);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Изображение ${partNumber}.png не найдено`);
    }

    const edges = this.getEdgesToBlur(partNumber);
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Не удалось получить размеры изображения');
    }

    const blurredImage = await this.applyEdgeBlur(
      image,
      metadata.width,
      metadata.height,
      edges,
    );
    this.logger.log(`К изображению ${partNumber}.png применён блюр по линии разреза.`)

    await blurredImage.toFile(imagePath);
    this.logger.log(`Изображение ${partNumber}.png с блюром сохранено.`)
    return imagePath;
  }

  private getEdgesToBlur(partNumber: number): {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  } {
    switch (partNumber) {
      case 1: return { top: false, right: true, bottom: true, left: false };
      case 2: return { top: false, right: false, bottom: true, left: true };
      case 3: return { top: true, right: false, bottom: false, left: true };
      case 4: return { top: true, right: true, bottom: false, left: false };
      default: throw new Error('Invalid partNumber');
    }
  }

  private async applyEdgeBlur(
    image: sharp.Sharp,
    width: number,
    height: number,
    edges: { top: boolean; right: boolean; bottom: boolean; left: boolean },
  ): Promise<sharp.Sharp> {
    const composites = [];
  
    if (edges.top) {
      const topBlur = await image
        .clone()
        .extract({ left: 0, top: 0, width, height: this.blurSize })
        .blur(this.configService.get(BLUR_STRENGTH))
        .toBuffer();
      composites.push({ input: topBlur, top: 0, left: 0 });
    }
  
    if (edges.right) {
      const rightBlur = await image
        .clone()
        .extract({ 
          left: width - this.blurSize, 
          top: 0, 
          width: this.blurSize, 
          height 
        })
        .blur(this.configService.get(BLUR_STRENGTH))
        .toBuffer();
      composites.push({ 
        input: rightBlur, 
        top: 0, 
        left: width - this.blurSize 
      });
    }
  
    if (edges.bottom) {
      const bottomBlur = await image
        .clone()
        .extract({ 
          left: 0, 
          top: height - this.blurSize, 
          width, 
          height: this.blurSize 
        })
        .blur(this.configService.get(BLUR_STRENGTH))
        .toBuffer();
      composites.push({ 
        input: bottomBlur, 
        top: height - this.blurSize, 
        left: 0 
      });
    }
  
    if (edges.left) {
      const leftBlur = await image
        .clone()
        .extract({ left: 0, top: 0, width: this.blurSize, height })
        .blur(this.configService.get(BLUR_STRENGTH))
        .toBuffer();
      composites.push({ input: leftBlur, top: 0, left: 0 });
    }
  
    return sharp(await image.toBuffer())
      .composite(composites);
  }
}