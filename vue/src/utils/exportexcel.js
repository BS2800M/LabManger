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
    'BatchId': item.batchId ?? '',
    '试剂名称': item.reagentNameSnapshot ?? item.reagent?.name ?? '',
    '批号': item.lotNameSnapshot ?? item.lot?.name ?? '',
    '数量': item.number ?? 0,
    '动作': format_operation_action(null, null, item.action),
    '用户': item.user?.userName ?? '',
    '条码列表': Array.isArray(item.detailData) ? item.detailData.map((d) => d.barcodeNumber).join(', ') : '',
    '注释': item.note ?? '',
  }))

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('操作记录')
  worksheet.columns = [
    { header: '时间', key: '时间', width: 24 },
    { header: 'BatchId', key: 'BatchId', width: 16 },
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

  const warnLabels = {
    0: '正常',
    1: '数量预警',
    2: '效期预警',
  }

  const exportData = []
  for (const parent of result.data || []) {
    const children = Array.isArray(parent.children) ? parent.children : []
    if (children.length === 0) {
      exportData.push({
        '试剂名称': parent.reagentName ?? '',
        '批号': '',
        '规格': parent.specifications ?? '',
        '库存数': parent.number ?? 0,
        '试剂总库存': parent.number ?? 0,
        '有效期': '',
        '警告数量': parent.warnNumber ?? 0,
        '预警类型': warnLabels[parent.warn] ?? '正常',
      })
      continue
    }

    for (const child of children) {
      exportData.push({
        '试剂名称': child.reagentName ?? parent.reagentName ?? '',
        '批号': child.lotName ?? '',
        '规格': child.specifications ?? parent.specifications ?? '',
        '库存数': child.number ?? 0,
        '试剂总库存': parent.number ?? 0,
        '有效期': child.lotExpirationDate
          ? formatDateColumn(null, null, child.lotExpirationDate)
          : '',
        '警告数量': child.warnNumber ?? parent.warnNumber ?? 0,
        '预警类型': warnLabels[child.warn] ?? '正常',
      })
    }
  }

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('库存表')
  worksheet.columns = [
    { header: '试剂名称', key: '试剂名称', width: 20 },
    { header: '批号', key: '批号', width: 20 },
    { header: '规格', key: '规格', width: 10 },
    { header: '库存数', key: '库存数', width: 10 },
    { header: '试剂总库存', key: '试剂总库存', width: 12 },
    { header: '有效期', key: '有效期', width: 20 },
    { header: '警告数量', key: '警告数量', width: 10 },
    { header: '预警类型', key: '预警类型', width: 12 },
  ]
  exportData.forEach((row) => worksheet.addRow(row))

  await downloadWorkbook(workbook, '库存表')
}

export { operation_exporttoexcel_list, inventory_exporttoexcel_list, sensorRecord_exporttoexcel_list }
