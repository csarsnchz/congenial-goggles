import { BadRequestException, Injectable } from '@nestjs/common';
import e from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    getFileName(fileName: string) {
        const path = join(__dirname, '../../static/uploads', fileName);
        if (!existsSync(path)) {
            throw new BadRequestException('The file you are looking for does not exist.');
        }
        return path;
    }
}
