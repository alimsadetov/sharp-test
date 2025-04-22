import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageProcessingService } from '../services/image-processing.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('image-processing')
@Controller('image-processing')
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async processImage(
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const processedImageBuffer = await this.imageProcessingService.processImage(
      file.buffer,
    );

    res.writeHead(HttpStatus.OK, {
      'Content-Type': 'image/png',
      'Content-Length': processedImageBuffer.length,
      'Content-Disposition': 'inline; filename="processed.png"',
    });

    res.end(processedImageBuffer);
  }
}
