import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

/**
 * 打开错误消息框。
 * @param {Object} params 参数对象。
 * @param {string} [params.title='错误提示'] 标题。
 * @param {string} params.message 消息内容。
 * @param {() => void | null} [params.action=null] 自定义确认行为。
 */
export function openErrorMessageBox({ title = '错误提示', message, action = null } = {}) {
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {
    type: 'error',
    title,
    message,
    action,
  })
}

/**
 * 打开确认提示框。
 * @param {Object} params 参数对象。
 * @param {string} [params.title='请确认'] 标题。
 * @param {string} params.message 消息内容。
 * @param {() => void} params.action 点击确认后的行为。
 */
export function openConfirmMessageBox({ title = '请确认', message, action } = {}) {
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {
    type: 'confirm',
    title,
    message,
    action,
  })
}

/**
 * 打开普通消息提示框。
 * @param {Object} params 参数对象。
 * @param {string} [params.title='提示'] 标题。
 * @param {string} params.message 消息内容。
 */
export function openInfoMessageBox({ title = '提示', message } = {}) {
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, {
    type: 'info',
    title,
    message,
  })
}

/**
 * 关闭消息框。
 */
export function closeMessageBox() {
  eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
}
