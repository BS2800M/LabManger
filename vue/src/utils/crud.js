import { closeMessageBox, openConfirmMessageBox, openInfoMessageBox } from '@/utils/messagebox'

/**
 * 判断表单是否满足全部必填条件。
 * @param {Object} formData 表单数据对象。
 * @param {string[]} requiredFields 必填字段名列表。
 * @returns {boolean} 全部字段都有效时返回 true，否则返回 false。
 */
export function hasAllRequiredFields(formData, requiredFields) {
  return requiredFields.every((field) => {
    const value = formData[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value != null
  })
}

/**
 * 根据必填字段状态同步提交按钮禁用状态。
 * @param {Object} params 参数对象。
 * @param {Object} params.formData 表单数据对象。
 * @param {string[]} params.requiredFields 必填字段名列表。
 * @param {Object} params.target 目标状态对象（通常为页面 state）。
 * @param {string} params.disabledKey 目标对象中的禁用状态字段名。
 * @returns {boolean} 当前禁用状态值。
 */
export function syncSubmitDisabledByFields({ formData, requiredFields, target, disabledKey }) {
  target[disabledKey] = !hasAllRequiredFields(formData, requiredFields)
  return target[disabledKey]
}

/**
 * 按当前选中状态弹出删除确认框；未选中时弹出提示框。
 * @param {Object} params 参数对象。
 * @param {number|string|null} params.selectedRowId 当前选中行 ID。
 * @param {string} params.title 弹窗标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {string} params.confirmMessage 删除确认文案。
 * @param {Function} params.onConfirm 用户确认后的回调函数。
 * @returns {boolean} 成功弹出确认框返回 true，否则返回 false。
 */
export function showDeleteConfirmBySelection({
  selectedRowId,
  title,
  emptyMessage,
  confirmMessage,
  onConfirm,
}) {
  if (selectedRowId == null) {
    openInfoMessageBox({ title, message: emptyMessage })
    return false
  }
  openConfirmMessageBox({ title, message: confirmMessage, action: onConfirm })
  return true
}

/**
 * 按当前选中状态执行删除逻辑；未选中时弹出提示框。
 * @param {Object} params 参数对象。
 * @param {number|string|null} params.selectedRowId 当前选中行 ID。
 * @param {string} params.title 弹窗标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {Function} params.deleteAction 执行删除的函数，签名为 deleteAction(selectedRowId)。
 * @param {Function} [params.onAfterDelete] 删除完成后的可选回调。
 * @returns {Promise<boolean>} 删除流程成功返回 true，否则返回 false。
 */
export async function deleteWithSelection({
  selectedRowId,
  title,
  emptyMessage,
  deleteAction,
  onAfterDelete,
}) {
  if (selectedRowId == null) {
    openInfoMessageBox({ title, message: emptyMessage })
    return false
  }

  await deleteAction(selectedRowId)
  if (typeof onAfterDelete === 'function') await onAfterDelete()
  closeMessageBox()
  return true
}

/**
 * 按上游值同步下游选项列表，并保证当前值有效。
 * @param {Object} params 参数对象。
 * @param {*} params.parentValue 上游值；为空时会清空下游选项并重置下游值。
 * @param {Function} params.fetchList 拉取下游数据的方法，签名为 fetchList(parentValue)。
 * @param {Function} params.mapOption 将数据项映射为选项对象的方法，需返回 { value, label }。
 * @param {*} params.currentValue 当前下游选中值。
 * @param {Function} params.setOptions 设置下游选项列表的方法。
 * @param {Function} params.setValue 设置下游选中值的方法。
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
 * 以指定模式打开抽屉，并执行可选的打开前后钩子。
 * @param {Object} params 参数对象。
 * @param {Object} params.state 页面状态对象，需包含 drawerMode、selectedRowId、drawer。
 * @param {string} params.mode 抽屉模式（例如 add、edit）。
 * @param {Function} [params.beforeOpen] 打开前执行的可选回调。
 * @param {Function} [params.afterOpen] 打开后执行的可选回调。
 */
export function openDrawerByMode({ state, mode, beforeOpen, afterOpen }) {
  if (typeof beforeOpen === 'function') beforeOpen()
  state.drawerMode = mode
  state.selectedRowId = null
  state.drawer = true
  if (typeof afterOpen === 'function') afterOpen()
}

/**
 * 统一新增流程：清空选中状态、可选重置表单、再执行打开动作。
 * @param {Object} params 参数对象。
 * @param {Function} params.setSelectedRowId 设置选中行 ID 的方法。
 * @param {Function} [params.resetFormData] 重置表单的方法。
 * @param {Function} params.onOpen 打开抽屉或弹窗的方法。
 */
export function openAddDrawerFlow({ setSelectedRowId, resetFormData, onOpen }) {
  setSelectedRowId(null)
  if (typeof resetFormData === 'function') resetFormData()
  onOpen()
}

/**
 * 尝试按“编辑模式”打开抽屉；未选中记录时提示用户。
 * @param {Object} params 参数对象。
 * @param {number|string|null} params.selectedRowId 当前选中行 ID。
 * @param {string} params.title 提示框标题。
 * @param {string} params.emptyMessage 未选中时提示文案。
 * @param {Function} params.onOpen 打开抽屉的方法。
 * @returns {boolean} 打开成功返回 true，否则返回 false。
 */
export function tryOpenEditDrawerBySelection({
  selectedRowId,
  title,
  emptyMessage,
  onOpen,
}) {
  if (selectedRowId != null) {
    onOpen()
    return true
  }
  openInfoMessageBox({ title, message: emptyMessage })
  return false
}

/**
 * 创建“单选且可取消选中”的复选框控制器。
 * @param {Object} params 参数对象。
 * @param {Function} params.getSelectedRowId 获取当前选中行 ID 的方法。
 * @param {Function} params.setSelectedRowId 设置当前选中行 ID 的方法。
 * @param {Function} [params.getRowId=(row)=>row.id] 从行数据中取行 ID 的方法。
 * @param {Function} [params.onSelect] 选中行后的回调，签名为 onSelect(rowData)。
 * @param {Function} [params.onDeselect] 取消选中后的回调。
 * @returns {{onToggle: Function, onToggleByChecked: Function, onCheckboxSelect: Function}} 选择控制器方法集合。
 */
export function createSingleToggleSelection({
  getSelectedRowId,
  setSelectedRowId,
  getRowId = (row) => row.id,
  onSelect,
  onDeselect,
}) {
  /**
   * 选中指定行，并触发选中回调。
   * @param {Object} rowData 行数据对象。
   * @param {number|string} [rowId=getRowId(rowData)] 行 ID。
   */
  function selectRow(rowData, rowId = getRowId(rowData)) {
    setSelectedRowId(rowId)
    if (typeof onSelect === 'function') onSelect(rowData)
  }

  /**
   * 取消当前选中行，并触发取消回调。
   */
  function deselectRow() {
    setSelectedRowId(null)
    if (typeof onDeselect === 'function') onDeselect()
  }

  /**
   * 切换选中状态：已选中则取消，未选中则选中。
   * @param {Object} rowData 行数据对象。
   * @returns {boolean} 选中返回 true，取消返回 false。
   */
  function onToggle(rowData) {
    const rowId = getRowId(rowData)
    const isSameSelection = getSelectedRowId() === rowId
    if (isSameSelection) {
      deselectRow()
      return false
    }

    selectRow(rowData, rowId)
    return true
  }

  /**
   * 根据复选框 checked 值设置选中状态。
   * @param {Object} params 参数对象。
   * @param {boolean} params.checked 当前复选框状态。
   * @param {Object} params.rowData 行数据对象。
   * @returns {boolean} 选中返回 true，取消返回 false。
   */
  function onToggleByChecked({ checked, rowData }) {
    const rowId = getRowId(rowData)

    if (checked) {
      if (getSelectedRowId() !== rowId) selectRow(rowData, rowId)
      return true
    }

    if (getSelectedRowId() === rowId) deselectRow()
    return false
  }

  /**
   * 兼容旧调用命名：内部等同于 onToggle。
   * @param {Object} rowData 行数据对象。
   * @returns {boolean} 选中返回 true，取消返回 false。
   */
  function onCheckboxSelect(rowData) {
    return onToggle(rowData)
  }

  return {
    onToggle,
    onToggleByChecked,
    onCheckboxSelect,
  }
}
