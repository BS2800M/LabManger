export interface SessionUser {
    sessionId: string;
    userId: number;
    teamId: number;
    role: number;
}
export declare const SessionUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
