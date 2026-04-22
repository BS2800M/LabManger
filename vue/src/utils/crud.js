import { closeMessageBox, openConfirmMessageBox, openInfoMessageBox } from '@/utils/messagebox'

export function hasAllRequiredFields(formData, requiredFields) {
  return requiredFields.every((field) => {
    const value = formData[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value != null
  })
}

export function syncSubmitDisabledByFields({ formData, requiredFields, target, disabledKey }) {
  target[disabledKey] = !hasAllRequiredFields(formData, requiredFields)
  return target[disabledKey]
}

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

export function openDrawerByMode({ state, mode, beforeOpen, afterOpen }) {
  if (typeof beforeOpen === 'function') beforeOpen()
  state.drawerMode = mode
  state.selectedRowId = null
  state.drawer = true
  if (typeof afterOpen === 'function') afterOpen()
}

export function openAddDrawerFlow({ setSelectedRowId, resetFormData, onOpen }) {
  setSelectedRowId(null)
  if (typeof resetFormData === 'function') resetFormData()
  onOpen()
}

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

// Checkbox single-select controller with deselect support.
export function createSingleToggleSelection({
  getSelectedRowId,
  setSelectedRowId,
  getRowId = (row) => row.id,
  onSelect,
  onDeselect,
}) {
  function selectRow(rowData, rowId = getRowId(rowData)) {
    setSelectedRowId(rowId)
    if (typeof onSelect === 'function') onSelect(rowData)
  }

  function deselectRow() {
    setSelectedRowId(null)
    if (typeof onDeselect === 'function') onDeselect()
  }

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

  function onToggleByChecked({ checked, rowData }) {
    const rowId = getRowId(rowData)

    if (checked) {
      if (getSelectedRowId() !== rowId) selectRow(rowData, rowId)
      return true
    }

    if (getSelectedRowId() === rowId) deselectRow()
    return false
  }

  function onCheckboxSelect(rowData) {
    return onToggle(rowData)
  }

  return {
    onToggle,
    onToggleByChecked,
    onCheckboxSelect,
  }
}
