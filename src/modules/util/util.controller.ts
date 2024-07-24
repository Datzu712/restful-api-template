import { MultipartFile } from '@fastify/multipart';
import { Post } from '@nestjs/common/decorators/http';
import { read as readXLSX, utils as XLSXUtils } from 'xlsx';

import { Controller, UseInterceptors } from '@nestjs/common/decorators/core';
import { File } from '@app/helpers/decorators/file.decorator';

/**
 * If you don't want to read files or parse excel files you should remove:
 * @fastify/multipart - npm remove @fastify/multipart (For reading files)
 * xlsx - npm remove xlsx (For parsing excel files)
 */
@Controller()
export class UtilController {
    @Post('readXLSX')
    @UseInterceptors()
    public async checkXLS(@File() multipart: MultipartFile) {
        const workbook = readXLSX(await multipart.toBuffer(), { type: 'buffer' });
        const worksheet = workbook.Sheets['data'];
        const data = XLSXUtils.sheet_to_json(worksheet);

        return {
            message: 'Success',
            data,
        };
    }
}
