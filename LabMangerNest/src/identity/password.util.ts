import { createHash, randomBytes } from 'crypto';

export const generateSalt = (): string => {
    return randomBytes(16).toString('hex').toUpperCase();
};

export const hashWithSalt = (password: string, salt: string): string => {
    const hash = createHash('sha256');
    hash.update(`${salt}${password}`, 'utf8');
    return hash.digest('hex').toUpperCase();
};
