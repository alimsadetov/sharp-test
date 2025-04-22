import { Module } from '@nestjs/common';
import { ImageProcessingController } from './controllers/image-processing.controller';
import { ImageProcessingService } from './services/image-processing.service';
import { BlurService } from './services/blur.service';
import { MergeService } from './services/merge.service';
import { SplitService } from './services/split.service';

@Module({
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService, BlurService, MergeService, SplitService],
})
export class ImageProcessingModule {} 