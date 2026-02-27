import { UserService } from './user.service';
import { UserDto } from './user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    add(body: UserDto['requestAdd']): Promise<{
        success: boolean;
        data: {
            id: number;
            userName: string;
            role: import("../common/enums/enums").UserRole;
            status: number;
            teamId: number;
            teamName?: string;
            passWord?: string;
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
    show(query: UserDto['requestShow']): Promise<{
        success: boolean;
        data: {
            id: number;
            userName: string;
            role: import("../common/enums/enums").UserRole;
            status: number;
            teamId: number;
            teamName?: string;
            passWord?: string;
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
    update(body: UserDto['requestUpdate']): Promise<{
        success: boolean;
        data: {
            id: number;
            userName: string;
            role: import("../common/enums/enums").UserRole;
            status: number;
            teamId: number;
            teamName?: string;
            passWord?: string;
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
    del(body: UserDto['requestDel']): Promise<{
        success: boolean;
        data: {
            id: number;
            userName: string;
            role: import("../common/enums/enums").UserRole;
            status: number;
            teamId: number;
            teamName?: string;
            passWord?: string;
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
