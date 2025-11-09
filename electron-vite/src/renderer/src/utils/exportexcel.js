
import {Workbook} from 'exceljs'
import {api_operation_show} from '@/api/operation'
import {api_inventory_show} from '@/api/inventory'
import {formatDateColumn,format_operation_action} from '@/utils/format'

  async  function operation_exporttoexcel_list() {
    
    let result = await api_operation_show({page:1,pagesize:1000})
    // 取出数据数组
    let exportData = result.data || []
    // 准备导出数据
    exportData = exportData.map(item => ({
      '时间': formatDateColumn(null, null, item.createTime),
      '试剂名称': item.reagentName,
      '批号': item.lotName,
      '动作': format_operation_action(null, null, item.action),
      '用户': item.userName,
      '条码号': item.barcodeNumber,
      '注释': item.note
    }))

    // 使用 exceljs 创建工作簿和工作表
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('操作记录')

    // 添加表头
    worksheet.columns = [
      { header: '时间', key: '时间', width: 30 },
      { header: '试剂名称', key: '试剂名称', width: 30 },
      { header: '批号', key: '批号', width: 20 },
      { header: '动作', key: '动作', width: 10 },
      { header: '用户', key: '用户', width: 10 },
      { header: '条码号', key: '条码号', width: 20 },
      { header: '注释', key: '注释', width: 40 }
    ]

    // 添加数据行
    exportData.forEach(row => {
      worksheet.addRow(row)
    })

    // 生成并下载 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `操作记录${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
async function inventory_exporttoexcel_list(){
    let result = await api_inventory_show({page:1,pagesize:1000})
    // 取出数据数组
    let exportData = result.data || []
    // 准备导出数据
    exportData = exportData.map(item => ({
      '试剂名称': item.reagentName,
      '批号': item.lotName,
      '规格': item.specifications,
      '应库存': item.number,
      '实际库存': null,
      '有效期':formatDateColumn(null, null, item.lotExpirationDate),
      '警告数量': item.warnNumber,
  
    }))
    console.log(exportData)
    // 使用 exceljs 创建工作簿和工作表
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('盘库表')
    // 添加表头
    worksheet.columns = [
      { header: '试剂名称', key: '试剂名称', width: 20 },
      { header: '批号', key: '批号', width: 20 },
      { header: '规格', key: '规格', width: 8 },
      { header: '应库存', key: '应库存', width: 8 },
      { header: '实际库存', key: '实际库存', width:10 },
      { header: '有效期', key: '有效期', width: 20 },
      { header: '警告数量', key: '警告数量', width: 8 },
  
    ]
  
    // 添加数据行
    exportData.forEach(row => {
      worksheet.addRow(row)
    })
  
    // 生成并下载 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `盘库表${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}



export {operation_exporttoexcel_list,inventory_exporttoexcel_list}