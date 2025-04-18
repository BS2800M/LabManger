import mitt from 'mitt'

// 创建事件总线实例
export const eventBus = mitt()

// 定义事件类型常量，便于维护和使用
export const EVENT_TYPES = {
  TEMPLATE_UPDATED: 'template-updated',    // 试剂模板更新事件
  LOT_UPDATED: 'lot-updated',             // 试剂批号更新事件
  OPERATION_UPDATED: 'operation-updated', // 出入库信息更新事件
} 