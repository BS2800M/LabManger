/**
 * 将简洁时间格式转换为ISO时间格式
 * @param time 简洁时间字符串 (格式: YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss)
 * @returns ISO格式的时间字符串
 */
export const formatisotime = (time: string): string => {
    if (!time) return '';
    
    // 如果已经是ISO格式，直接返回
    if (time.includes('T')) return time;
    
    // 处理只有日期的情况 (YYYY-MM-DD)
    if (time.length === 10) {
        return `${time}T00:00:00.000Z`;
    }
    
    // 处理有日期和时间的情况 (YYYY-MM-DD HH:mm:ss)
    if (time.length === 19) {
        return `${time.replace(' ', 'T')}.000Z`;
    }
    
    throw new Error('Invalid time format. Expected YYYY-MM-DD or YYYY-MM-DD HH:mm:ss');
}

/**
 * 将ISO时间格式转换为简洁时间格式
 * @param isotime ISO格式的时间字符串
 * @returns 简洁时间字符串 (YYYY-MM-DD HH:mm:ss)
 */
export const formatSimpleTime = (isotime: string): string => {
    if (!isotime) return '';
    
    // 移除毫秒和时区信息
    return isotime.split('.')[0].replace('T', ' ');
} 