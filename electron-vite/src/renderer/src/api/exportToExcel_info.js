import ExcelJS from 'exceljs'
import {api_operation_show_exportToExcel} from '@/api/operation'
import {format_iso_YYYYMMDDHHmm} from '@/api/dateformat'
async function exportToExcel_info(){
    const teamname=localStorage.teamname
    const workbook = new ExcelJS.Workbook()
    let allreagent=await api_operation_show_exportToExcel()
    allreagent=allreagent.data //获取所有试剂信息
    for (const item of allreagent){ //遍历所有试剂信息

        try{
            // 为每个试剂创建工作表
            let worksheet = workbook.addWorksheet(item.reagentname)

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
            worksheet.getRow(4).getCell('A').value = item.reagentname
            worksheet.mergeCells('A4:B4')
            worksheet.getRow(4).getCell('C').value = item.storage_condition
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



            
            for(let i=0;i<item.operationlist.length;i++){
                worksheet.getRow(7+i).getCell('A').value = format_iso_YYYYMMDDHHmm(item.operationlist[i].creation_time)
                worksheet.getRow(7+i).getCell('B').value = item.operationlist[i].lotname
                worksheet.getRow(7+i).getCell('C').value = format_iso_YYYYMMDDHHmm(item.operationlist[i].lotexpiration_date)
                worksheet.getRow(7+i).getCell('D').value = item.operationlist[i].inbound_number
                worksheet.getRow(7+i).getCell('E').value = item.operationlist[i].outbound_number
                worksheet.getRow(7+i).getCell('F').value = item.operationlist[i].inventory_number
                worksheet.getRow(7+i).getCell('G').value = item.operationlist[i].specifications
                worksheet.getRow(7+i).getCell('H').value = item.operationlist[i].username
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

export {exportToExcel_info}