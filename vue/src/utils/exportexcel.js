import ExcelJS from 'exceljs'
import { ElMessage } from 'element-plus'
import { api_operation_showall } from '@/api/operation'
import { api_sensorRecord_showAll } from '@/api/sensorRecord'
import { formatDateColumn, format_operation_action } from '@/utils/format'
import { api_inventory_showAll } from '@/api/inventory'
function formatDateForFilename(date = new Date()) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function downloadWorkbookByExceljs({ sheetName, rows, columns, filenamePrefix }) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)
  worksheet.addRow(columns.map((col) => col.header))

  rows.forEach((row) => {
    worksheet.addRow(columns.map((col) => row[col.key] ?? ''))
  })

  columns.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const fileName = `${filenamePrefix}${formatDateForFilename()}.xlsx`
  const blob = new Blob(
    [buffer],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  )
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

async function sensorRecord_exporttoexcel_list(filter = {}) {
  try {
    const result = await api_sensorRecord_showAll({
      locationName: filter.locationName ?? '',
      startTime: filter.startTime ?? '',
      endTime: filter.endTime ?? '',
      page: 1,
      pageSize: 10000,
    })

    const exportData = (result.data || []).map((item) => ({
      '时间': formatDateColumn(null, null, item.createdAt),
      '位置名称': item.location?.name ?? '',
      '温度': item.temperature,
      '湿度': item.humidity,
      '小组': item.team?.name ?? item.teamName ?? '',
    }))

    const columns = [
      { header: '时间', key: '时间', width: 20 },
      { header: '位置名称', key: '位置名称', width: 20 },
      { header: '温度', key: '温度', width: 10 },
      { header: '湿度', key: '湿度', width: 10 },
      { header: '小组', key: '小组', width: 20 },
    ]

    await downloadWorkbookByExceljs({
      sheetName: '传感器记录',
      rows: exportData,
      columns,
      filenamePrefix: '传感器记录',
    })
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败，请稍后重试')
  }
}

async function operation_exporttoexcel_list(filter = {}) {
  try {
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
      '时间': formatDateColumn(null, null, item.createdAt),
      '试剂名称': item.reagentNameSnapshot ?? item.reagent?.name ?? '',
      '批号': item.lotNameSnapshot ?? item.lot?.name ?? '',
      '数量': item.actionNum ?? 0,
      '动作': format_operation_action(null, null, item.action),
      '用户': item.user?.userName ?? '',
      '注释': item.note ?? '',
    }))

    const columns = [
      { header: '时间', key: '时间', width: 24 },
      { header: '试剂名称', key: '试剂名称', width: 24 },
      { header: '批号', key: '批号', width: 20 },
      { header: '数量', key: '数量', width: 10 },
      { header: '动作', key: '动作', width: 10 },
      { header: '用户', key: '用户', width: 12 },
      { header: '注释', key: '注释', width: 30 },
    ]

    await downloadWorkbookByExceljs({
      sheetName: '操作记录',
      rows: exportData,
      columns,
      filenamePrefix: '操作记录',
    })
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败，请稍后重试')
  }
}

async function inventory_exportExcel_list(filter = {}) {
  try {
    const result = await api_inventory_showAll({
      name: filter.name,
      page: 1,
      pageSize: 10000,
    })

    const exportData = (result.data || []).map((item) => ({
      '试剂名称': item.reagent?.name ?? '',
      '批号': item.name ?? '',
      '有效期': formatDateColumn(null, null, item.expirationDate),
      '该批号数量': item.number ?? 0,
      '该试剂数量': item.reagent?.number ?? 0,
      '预警数量': item.warnNumber ?? 0,
      '最后出库时间': formatDateColumn(null, null, item.updatedAt),

    }))

    const columns = [
      { header: '试剂名称', key: '试剂名称', width: 24 },
      { header: '批号', key: '批号', width: 20 },
      { header: '有效期', key: '有效期', width: 20 },
      { header: '该批号数量', key: '该批号数量', width: 15 },
      { header: '该试剂数量', key: '该试剂数量', width: 15 },
      { header: '预警数量', key: '预警数量', width: 15 },
      { header: '最后出库时间', key: '最后出库时间', width: 24 },
    ]

  await downloadWorkbookByExceljs({
      sheetName: '库存列表',
      rows: exportData,
      columns,
      filenamePrefix: '库存列表',
    })
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败，请稍后重试')
  }
  
}
export { operation_exporttoexcel_list, sensorRecord_exporttoexcel_list,inventory_exportExcel_list }
