import { MultipartFile } from '@fastify/multipart';
import { Post } from '@nestjs/common/decorators/http';
import { read as readXLSX, utils as XLSXUtils } from 'xlsx';

import { Controller, UseInterceptors } from '@nestjs/common/decorators/core';
import { File } from '@app/helpers/decorators/file.decorator';

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
