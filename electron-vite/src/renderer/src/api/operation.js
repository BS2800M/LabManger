import { myrequest } from './request'
export let api_operation_inbound=(inboundlist)=>{
    return myrequest.post('/operation/inbound/',{
          "inboundlist":inboundlist,
          
          })
    }


export let api_operation_outbound=(body)=>{
          return myrequest.post('/operation/outbound/',{
                barcodenumber:body.barcodenumber,
                })
          }

export let api_operation_special_outbound=(body)=>{
return myrequest.post('/operation/special_outbound/',{
    outboundlist:body
    })
}      




export let api_operation_show=(body)=>{
return myrequest.get('/operation/show/',{
    reagentname:body.reagentName,
    starttime:body.starttime,
    endtime:body.endtime,
    barcodenumber:body.barcodeNumber,
    page:body.page,
    pagesize:body.pagesize
    })
}

export let api_operation_update=(body)=>{
    return myrequest.put('/operation/update/',{
        id:body.id,
        reagentid:body.reagentid,
        lotid:body.lotid,
        note:body.note,
        action:body.action,
        createTime:body.createTime,
    })
}
export let api_operation_del=(deleteid)=>{
return myrequest.put('/operation/del/',{
    id:deleteid
    })
}

export let api_operation_show_exportToExcel=(body)=>{
return myrequest.get('/operation/show_exportToExcel/',{
    })
}