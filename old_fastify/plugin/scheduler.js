import { inventory_audit_list } from "../view/inventory.js";
export async function startScheduledTasks() {
    // 每周一凌晨2点执行统计任务
    setInterval(async () => {
        const now = new Date();
        const hour = now.getHours();
        // 每天凌晨2点执行
        if (hour === 2) {
            console.log('执行每天：库存审计数量统计');
            await inventory_audit_list();
        }
    }, 60 * 60 * 1000); // 每小时检查一次
}
