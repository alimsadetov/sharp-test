import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { CustomLoggerService } from '@/logger/custom-logger.service';

@Injectable()
export class MergeService {
  private readonly imagesDir = 'images';

  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('MergeService')
  }

  async mergeImages(): Promise<Buffer> {
    const partPaths = [1, 2, 3, 4].map(num => 
      path.join(this.imagesDir, `${num}.png`)
    );

    for (const path of partPaths) {
      if (!fs.existsSync(path)) {
        throw new Error(`Не найдена часть изображения: ${path}`);
      }
    }

    const parts = await Promise.all(partPaths.map(path => sharp(path).metadata()));

    this.logger.log('Части изображения для объединения получены.')

    const firstPart = parts[0];

    const mergedWidth = firstPart.width! * 2;
    const mergedHeight = firstPart.height! * 2;

    const compositeLayers = [
      { input: partPaths[0], top: 0, left: 0 },                    
      { input: partPaths[1], top: 0, left: firstPart.width! },    
      { input: partPaths[2], top: firstPart.height!, left: firstPart.width! },
      { input: partPaths[3], top: firstPart.height!, left: 0 }     
    ];

    return sharp({
      create: {
        width: mergedWidth,
        height: mergedHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite(compositeLayers)
      .png()
      .toBuffer();
  }
}