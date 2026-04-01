import { Workbook } from 'exceljs'
import { api_operation_showall } from '@/api/operation'
import { api_inventory_showall } from '@/api/inventory'
import { api_sensorRecord_showAll } from '@/api/sensorRecord'
import { formatDateColumn, format_operation_action } from '@/utils/format'

async function downloadWorkbook(workbook, filenamePrefix) {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}${new Date().toLocaleDateString()}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

async function sensorRecord_exporttoexcel_list(filter = {}) {
  const result = await api_sensorRecord_showAll({
    locationName: filter.locationName ?? '',
    startTime: filter.startTime ?? '',
    endTime: filter.endTime ?? '',
    page: 1,
    pageSize: 10000,
  })

  const exportData = (result.data || []).map((item) => ({
    '时间': formatDateColumn(null, null, item.createTime),
    '位置名称': item.location?.name ?? '',
    '温度': item.temperature,
    '湿度': item.humidity,
    '小组': item.team?.name ?? item.teamName ?? '',
  }))

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('传感器记录')
  worksheet.columns = [
    { header: '时间', key: '时间', width: 20 },
    { header: '位置名称', key: '位置名称', width: 20 },
    { header: '温度', key: '温度', width: 10 },
    { header: '湿度', key: '湿度', width: 10 },
    { header: '小组', key: '小组', width: 20 },
  ]
  exportData.forEach((row) => worksheet.addRow(row))

  await downloadWorkbook(workbook, '传感器记录')
}

async function operation_exporttoexcel_list(filter = {}) {
  const result = await api_operation_showall({
    reagentName: filter.reagentName,
    startTime: filter.startTime,
    endTime: filter.endTime,
    barcodeNumber: filter.barcodeNumber,
    udi: filter.udi,
    page: 1,
    pageSize: 9999999,
  })

  const exportData = (result.data || []).map((item) => ({
    '时间': formatDateColumn(null, null, item.createTime),
    'GroupId': item.groupId ?? '',
    '试剂名称': item.snapshots?.reagentName ?? item.reagent?.name ?? '',
    '批号': item.snapshots?.lotName ?? item.lot?.name ?? '',
    '数量': item.number ?? 0,
    '动作': format_operation_action(null, null, item.action),
    '用户': item.user?.userName ?? '',
    '条码列表': Array.isArray(item.barcodes) ? item.barcodes.join(', ') : '',
    '注释': item.notes ?? '',
  }))

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('操作记录')
  worksheet.columns = [
    { header: '时间', key: '时间', width: 24 },
    { header: 'GroupId', key: 'GroupId', width: 38 },
    { header: '试剂名称', key: '试剂名称', width: 24 },
    { header: '批号', key: '批号', width: 20 },
    { header: '数量', key: '数量', width: 10 },
    { header: '动作', key: '动作', width: 10 },
    { header: '用户', key: '用户', width: 12 },
    { header: '条码列表', key: '条码列表', width: 60 },
    { header: '注释', key: '注释', width: 30 },
  ]
  exportData.forEach((row) => worksheet.addRow(row))

  await downloadWorkbook(workbook, '操作记录')
}

async function inventory_exporttoexcel_list() {
  const result = await api_inventory_showall()

  const exportData = (result.data || []).map((item) => ({
    '试剂名称': item.reagent?.name ?? item.reagentName,
    '批号': item.lot?.name ?? item.lotName,
    '规格': item.reagent?.specifications ?? item.specifications,
    '库存数': item.number,
    '实际库存': null,
    '有效期': formatDateColumn(null, null, item.lot?.expirationDate ?? item.lotExpirationDate),
    '警告数量': item.reagent?.warnNumber ?? item.warnNumber,
  }))

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('库存表')
  worksheet.columns = [
    { header: '试剂名称', key: '试剂名称', width: 20 },
    { header: '批号', key: '批号', width: 20 },
    { header: '规格', key: '规格', width: 10 },
    { header: '库存数', key: '库存数', width: 10 },
    { header: '实际库存', key: '实际库存', width: 10 },
    { header: '有效期', key: '有效期', width: 20 },
    { header: '警告数量', key: '警告数量', width: 10 },
  ]
  exportData.forEach((row) => worksheet.addRow(row))

  await downloadWorkbook(workbook, '库存表')
}

export { operation_exporttoexcel_list, inventory_exporttoexcel_list, sensorRecord_exporttoexcel_list }
