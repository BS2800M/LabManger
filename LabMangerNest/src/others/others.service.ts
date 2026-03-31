import { Injectable } from '@nestjs/common';
import { OthersDto } from './others.dto';

@Injectable()
export class OthersService {
    async time(_dto: OthersDto['requestTime']): Promise<OthersDto['responseTime']> {
        return {
            success: true,
            data: {
                unixMs: Date.now(),
            },
        };
    }
}
