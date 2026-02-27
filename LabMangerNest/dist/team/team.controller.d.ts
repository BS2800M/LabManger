import { TeamService } from './team.service';
import { TeamDto } from './team.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    add(body: TeamDto['requestAdd']): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            note: string;
            status: number;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    show(query: TeamDto['requestShow']): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            note: string;
            status: number;
        }[];
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    update(body: TeamDto['requestUpdate']): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            note: string;
            status: number;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
    del(body: TeamDto['requestDel']): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            phone: string;
            note: string;
            status: number;
        };
        error?: {
            code: string;
            message: string;
            details?: any;
        };
        meta?: {
            page: number;
            pageSize: number;
            total: number;
            totalPage: number;
            timestamp?: string;
        };
    }>;
}
