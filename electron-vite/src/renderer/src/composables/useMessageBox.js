import { ref } from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

/**
 * MessageBox Composable
 * 在组件中提供便捷的消息框功能
 */
export function useMessageBox() {
  // 可以添加一些状态管理
  const isShowing = ref(false)
  const currentType = ref('')
  const currentMessage = ref('')

  /**
   * 显示消息框的通用方法
   */
  const showMessage = (type, message, action) => {
    isShowing.value = true
    currentType.value = type
    currentMessage.value = message
    
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {
      type,
      message,
      action: () => {
        isShowing.value = false
        if (action) action()
      }
    })
  }

  /**
   * 成功消息
   */
  const success = (message, action) => {
    showMessage('success', message, action)
  }

  /**
   * 警告消息
   */
  const warning = (message, action) => {
    showMessage('warning', message, action)
  }

  /**
   * 错误消息
   */
  const error = (message, action) => {
    showMessage('error', message, action)
  }

  /**
   * 信息消息
   */
  const info = (message, action) => {
    showMessage('info', message, action)
  }

  /**
   * 确认对话框
   */
  const confirm = (message, onConfirm, onCancel) => {
    showMessage('warning', message, onConfirm)
  }

  /**
   * 删除确认
   */
  const confirmDelete = (itemName, onConfirm) => {
    confirm(
      `确定要删除 "${itemName}" 吗？此操作不可撤销。`,
      onConfirm
    )
  }

  /**
   * 保存确认
   */
  const confirmSave = (onConfirm) => {
    confirm('是否保存当前修改？', onConfirm)
  }

  /**
   * 操作结果提示
   */
  const showResult = (isSuccess, successMsg = '操作成功', errorMsg = '操作失败') => {
    if (isSuccess) {
      success(successMsg)
    } else {
      error(errorMsg)
    }
  }

  // 返回响应式状态和方法
  return {
    // 状态
    isShowing,
    currentType,
    currentMessage,
    
    // 方法
    showMessage,
    success,
    warning,
    error,
    info,
    confirm,
    confirmDelete,
    confirmSave,
    showResult
  }
} 