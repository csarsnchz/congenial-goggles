import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}


  @Get('product/:fileName')
  findImage(
    @Res() res: Response,
    @Param('fileName') fileName: string) {
    const path = this.filesService.getFileName(fileName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',
    {fileFilter: fileFilter, storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })}
  ))
  uploadProductImae(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure to upload a file with the key "file" in the request body. The file should be of type jpg, jpeg, or png.');
    }
    const host = this.configService.get('HOST_API');
    if (!host) {
      throw new BadRequestException('The Host is not set in the .env file.');
    }
    const secureFileName = `${host}/files/product/${file.filename}`;
    return {secureFileName};
  }
}
