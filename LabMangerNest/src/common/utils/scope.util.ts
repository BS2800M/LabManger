import { SessionUser } from '../decorators/session-user.decorator';
import { UserRole } from '../enums/enums';

/**
 * 根据用户角色决定是否隔离团队数据。
 * 主任(Director)及以上不隔离，返回空对象；
 * 组长(Leader)及以下隔离，返回 { teamId }。
 */
export function teamScope(session: SessionUser): { teamId?: number } {
    if (session.role >= UserRole.Director) return {};
    return { teamId: session.teamId };
}
