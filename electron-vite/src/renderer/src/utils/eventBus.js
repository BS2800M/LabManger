import mitt from 'mitt'

// 创建事件总线实例
export const eventBus = mitt()

// 定义事件类型常量，便于维护和使用
export const EVENT_TYPES = {
  TEMPLATE_UPDATED: 'template-updated',    // 试剂模板更新事件
  LOT_UPDATED: 'lot-updated',             // 试剂批号更新事件
  OPERATION_UPDATED: 'operation-updated', // 出入库信息更新事件
  TEAM_UPDATED: 'team-updated',           // 团队信息更新事件
  USER_UPDATED: 'user-updated',           // 用户信息更新事件
  SHOW_MESSAGEBOX: 'show-messagebox',     // 显示消息框事件
  CLOSE_MESSAGEBOX: 'close-messagebox',   // 关闭消息框事件
} 