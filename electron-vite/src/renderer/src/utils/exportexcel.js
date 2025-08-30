
import {Workbook} from 'exceljs'
import {api_operation_exporttoexcel,api_operation_show} from '@/api/operation'
import {api_inventory_show} from '@/api/inventory'
import {format_iso_YYYYMMDDHHmm,formatDateColumn,format_operation_action} from '@/utils/format'
async function operation_exporttoexcel_info(){
    const teamname=localStorage.teamname
    const workbook = new Workbook()
    let allreagent=await api_operation_exporttoexcel()
    allreagent=allreagent.data //获取所有试剂信息
    for (const item of allreagent){ //遍历所有试剂信息

        try{
            // 为每个试剂创建工作表
            let worksheet = workbook.addWorksheet(item.reagentName)

            // 设置列宽
            worksheet.columns = [
                { key: 'A', width: 20 },
                { key: 'B', width: 20 },
                { key: 'C', width: 20 },
                { key: 'D', width: 10 },
                { key: 'E', width: 10 },
                { key: 'F', width: 10 },
                { key: 'G', width: 30 },
                { key: 'H', width: 20 }
            ]
            // 设置行高
            worksheet.getRow(1).height = 15
            worksheet.getRow(2).height = 15
            worksheet.getRow(3).height = 15
            worksheet.getRow(4).height = 15
            worksheet.getRow(6).height = 30
            // 添加标题行
            worksheet.getRow(2).getCell('A').value = '检验科试剂（耗材）出入库登记表'
            
            // 合并A2-H2单元格
            worksheet.mergeCells('A2:H2')
            // 设置标题样式
            const titleCell = worksheet.getCell('A2')
            titleCell.alignment = {
                horizontal: 'center',
                vertical: 'middle'
            }
            titleCell.font = {
                bold: true,
                size: 16,
                name: '微软雅黑'
            }
            worksheet.getRow(3).getCell('A').value = '试剂名称'
            worksheet.getRow(3).getCell('C').value = '保存条件'
            worksheet.getRow(3).getCell('G').value = '专业组'
            worksheet.getRow(4).getCell('A').value = item.reagentName
            worksheet.mergeCells('A4:B4')
            worksheet.getRow(4).getCell('C').value = item.storageCondition
            worksheet.getRow(4).getCell('G').value = teamname
            const cells_loaction=['A','B','C','D','E','F','G','H']
            const cells_value=['出入库时间','批号','效期','入库数量','出库数量','库存数量','规格','经手人']
            for(let i=0;i<cells_loaction.length;i++){
                worksheet.getRow(6).getCell(cells_loaction[i]).value = cells_value[i]
                worksheet.getRow(6).getCell(cells_loaction[i]).alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                }
            }



            
            for(let i=0;i<item.operationList.length;i++){
                worksheet.getRow(7+i).getCell('A').value = format_iso_YYYYMMDDHHmm(item.operationList[i].createTime)
                worksheet.getRow(7+i).getCell('B').value = item.operationList[i].lotName
                worksheet.getRow(7+i).getCell('C').value = format_iso_YYYYMMDDHHmm(item.operationList[i].expirationDate)
                worksheet.getRow(7+i).getCell('D').value = item.operationList[i].inboundNumber
                worksheet.getRow(7+i).getCell('E').value = item.operationList[i].outboundNumber
                worksheet.getRow(7+i).getCell('F').value = item.operationList[i].inventoryNumber
                worksheet.getRow(7+i).getCell('G').value = item.operationList[i].specifications
                worksheet.getRow(7+i).getCell('H').value = item.operationList[i].userName
            }


        }catch(error){
            console.error(`处理试剂 ${item.name} 时出错:`, error)
            continue
        }
    }
    
    // 保存文件
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `操作记录${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}
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



export {operation_exporttoexcel_info,operation_exporttoexcel_list,inventory_exporttoexcel_list}