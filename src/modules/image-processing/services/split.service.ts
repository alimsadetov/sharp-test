import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import { CustomLoggerService } from '@/logger/custom-logger.service';

@Injectable()
export class SplitService {
  private readonly imagesDir = 'images';

  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('SplitService')
  }

  async splitImage(image: sharp.Sharp, width: number, height: number): Promise<void> {
    const partWidth = Math.floor(width / 2);
    const partHeight = Math.floor(height / 2);

    for (let i = 0; i < 4; i++) {
      let x, y;
    switch (i) {
      case 0:
        x = 0;
        y = 0;
        break;
      case 1:
        x = partWidth;
        y = 0;
        break;
      case 2:
        x = partWidth;
        y = partHeight;
        break;
      case 3:
        x = 0;
        y = partHeight;
        break;
    }

      const outputPath = path.join(this.imagesDir, `${i + 1}.png`);
      let part = image.clone().extract({
        left: x,
        top: y,
        width: partWidth,
        height: partHeight,
      });

      await part.toFile(outputPath);
      this.logger.log(`Файл ${i+1}.png успешно сохранён.`)
    }
  }
}