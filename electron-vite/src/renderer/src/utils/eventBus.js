import mitt from 'mitt'

// 创建事件总线实例
export const eventBus = mitt()

// 定义事件类型常量，便于维护和使用
export const EVENT_TYPES = {
  SHOW_MESSAGEBOX: 'show-messagebox',     // 显示消息框事件
  CLOSE_MESSAGEBOX: 'close-messagebox',   // 关闭消息框事件
} 