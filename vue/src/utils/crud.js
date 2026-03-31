import { EVENT_TYPES } from '@/utils/eventBus'

/**
 * 判断表单必填字段是否全部已填写。
 * @param {Record<string, any>} formData 表单对象。
 * @param {string[]} requiredFields 必填字段名数组。
 * @returns {boolean} 是否全部填写。
 */
export function hasAllRequiredFields(formData, requiredFields) {
  return requiredFields.every((field) => {
    const value = formData[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value != null
  })
}

/**
 * 根据必填字段结果同步禁用态。
 * @param {Object} params 参数对象。
 * @param {Record<string, any>} params.formData 表单对象。
 * @param {string[]} params.requiredFields 必填字段名数组。
 * @param {Record<string, any>} params.target 需要写入禁用字段的目标对象（通常是 state 或 formData）。
 * @param {string} params.disabledKey 目标对象上的禁用字段名（如 submitDisabled）。
 * @returns {boolean} 最新禁用值。
 */
export function syncSubmitDisabledByFields({ formData, requiredFields, target, disabledKey }) {
  target[disabledKey] = !hasAllRequiredFields(formData, requiredFields)
  return target[disabledKey]
}

/**
 * 统一处理表格行“点击选中 / 再点取消选中”逻辑。
 * @param {Object} params 参数对象。
 * @param {any} params.rowData 当前点击行数据。
 * @param {boolean} params.isSameSelection 是否点击了当前已选中的同一行。
 * @param {(row: any) => any} [params.getRowId] 从行数据中提取选中 ID 的函数，默认 row.id。
 * @param {(id: any) => void} params.setSelectedRowId 写入选中 ID 的函数。
 * @param {(row: any) => void} [params.onSelect] 选中时回调。
 * @param {() => void} [params.onDeselect] 取消选中时回调。
 * @returns {boolean} true 表示选中，false 表示取消选中。
 */
export function toggleRowSelection({
  rowData,
  isSameSelection,
  getRowId = (row) => row.id,
  setSelectedRowId,
  onSelect,
  onDeselect,
}) {
  if (isSameSelection) {
    setSelectedRowId(null)
    if (typeof onDeselect === 'function') onDeselect()
    return false
  }

  setSelectedRowId(getRowId(rowData))
  if (typeof onSelect === 'function') onSelect(rowData)
  return true
}

/**
 * 删除前统一弹确认框；未选中时提示信息框。
 * @param {Object} params 参数对象。
 * @param {any} params.eventBus 事件总线实例。
 * @param {any} params.selectedRowId 当前选中行 ID。
 * @param {string} params.title 弹框标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {string} params.confirmMessage 确认弹框文案。
 * @param {() => void} params.onConfirm 点击确认后的回调。
 * @returns {boolean} true 表示已弹确认框，false 表示未选中。
 */
export function showDeleteConfirmBySelection({
  eventBus,
  selectedRowId,
  title,
  emptyMessage,
  confirmMessage,
  onConfirm,
}) {
  if (selectedRowId == null) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title, message: emptyMessage })
    return false
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'confirm', title, message: confirmMessage, action: onConfirm })
  return true
}

/**
 * 统一执行删除流程：选中校验 -> 删除 -> 后置刷新 -> 关闭弹框。
 * @param {Object} params 参数对象。
 * @param {any} params.eventBus 事件总线实例。
 * @param {any} params.selectedRowId 当前选中行 ID。
 * @param {string} params.title 弹框标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {(id: any) => Promise<any>} params.deleteAction 实际删除 API 调用。
 * @param {() => Promise<void> | void} [params.onAfterDelete] 删除后的刷新/清理回调。
 * @returns {Promise<boolean>} true 表示执行了删除，false 表示未选中未删除。
 */
export async function deleteWithSelection({
  eventBus,
  selectedRowId,
  title,
  emptyMessage,
  deleteAction,
  onAfterDelete,
}) {
  if (selectedRowId == null) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title, message: emptyMessage })
    return false
  }

  await deleteAction(selectedRowId)
  if (typeof onAfterDelete === 'function') await onAfterDelete()
  eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  return true
}

/**
 * 统一处理“上游字段变化 -> 重新加载下游下拉选项”联动逻辑。
 * @param {Object} params 参数对象。
 * @param {any} params.parentValue 上游字段值（如 reagentId）。
 * @param {(parentValue: any) => Promise<any[]>} params.fetchList 请求下游数据列表。
 * @param {(row: any) => {value: any, label: string}} params.mapOption 下游数据转下拉选项函数。
 * @param {any} params.currentValue 当前已选下游值。
 * @param {(options: Array<{value: any, label: string}>) => void} params.setOptions 写入下拉选项。
 * @param {(value: any) => void} params.setValue 写入下游选中值。
 * @returns {Promise<void>}
 */
export async function syncDependentOptions({
  parentValue,
  fetchList,
  mapOption,
  currentValue,
  setOptions,
  setValue,
}) {
  if (!parentValue) {
    setOptions([])
    setValue(null)
    return
  }

  const rows = await fetchList(parentValue)
  const options = rows.map(mapOption)
  setOptions(options)

  if (options.length === 0) {
    setValue(null)
    return
  }

  const hasCurrent = options.some((item) => item.value === currentValue)
  if (!hasCurrent) setValue(options[0].value)
}

/**
 * 统一初始化抽屉打开流程（mode、清空选中、打开抽屉）。
 * @param {Object} params 参数对象。
 * @param {Record<string, any>} params.state 抽屉状态对象，需包含 drawer/drawerMode/selectedRowId。
 * @param {string} params.mode 抽屉模式（如 add/edit）。
 * @param {() => void} [params.beforeOpen] 打开前回调（设置额外状态）。
 * @param {() => void} [params.afterOpen] 打开后回调（如同步按钮禁用态）。
 */
export function openDrawerByMode({ state, mode, beforeOpen, afterOpen }) {
  if (typeof beforeOpen === 'function') beforeOpen()
  state.drawerMode = mode
  state.selectedRowId = null
  state.drawer = true
  console.log(state.selectedRowId)
  if (typeof afterOpen === 'function') afterOpen()
}

/**
 * 统一“新增”按钮流程（清空选中 + 重置表单 + 打开抽屉）。
 * @param {Object} params 参数对象。
 * @param {any} [params.selectedRowId=null] 当前选中行 ID（与编辑流程参数保持一致）。
 * @param {(value: any) => void} params.setSelectedRowId 设置选中行 ID 的函数。
 * @param {() => void} [params.resetFormData] 重置表单回调。
 * @param {() => void} params.onOpen 真正打开抽屉的回调。
 */
export function openAddDrawerFlow({ selectedRowId = null, setSelectedRowId, resetFormData, onOpen }) {
  setSelectedRowId(selectedRowId)
  if (typeof resetFormData === 'function') resetFormData()
  onOpen()
}

/**
 * 统一“编辑”按钮流程（选中校验 + 打开抽屉或提示）。
 * @param {Object} params 参数对象。
 * @param {any} params.selectedRowId 当前选中行 ID。
 * @param {any} params.eventBus 事件总线实例。
 * @param {string} params.title 提示框标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {() => void} params.onOpen 选中有效时打开抽屉回调。
 * @returns {boolean} true 表示已打开，false 表示未选中。
 */
export function tryOpenEditDrawerBySelection({
  selectedRowId,
  eventBus,
  title,
  emptyMessage,
  onOpen,
}) {
  if (selectedRowId != null) {
    onOpen()
    return true
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title, message: emptyMessage })
  return false
}

/**
 * 统一生成表格行 class：状态 class + current-row 高亮。
 * @param {Object} params 参数对象。
 * @param {any} params.rowData 当前行数据。
 * @param {number} [params.rowIndex] 当前行索引。
 * @param {any} params.selectedRowId 当前选中行 ID。
 * @param {(row: any) => any} [params.getRowId] 获取当前行 ID，默认 row.id。
 * @param {(ctx: {row: any, rowindex: number}) => string} [params.getStatusClass] 计算状态 class 的函数。
 * @param {string} [params.defaultClass='normal-row'] 默认状态 class。
 * @returns {string} 行 class 字符串。
 */
export function resolveSelectableRowClass({
  rowData,
  rowIndex = 0,
  selectedRowId,
  getRowId = (row) => row.id,
  getStatusClass,
  defaultClass = 'normal-row',
}) {
  const statusClass = typeof getStatusClass === 'function'
    ? (getStatusClass({ row: rowData, rowindex: rowIndex }) || defaultClass)
    : defaultClass
  const rowId = getRowId(rowData)
  if (selectedRowId === rowId) return `${statusClass} current-row`.trim()
  return statusClass
}
