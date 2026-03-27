import { myrequest } from './request'

export let api_operation_inbound=(inboundList)=>{
    return myrequest.post('/stock/operations/inbound',{
        "inboundList": inboundList.map(item => ({
            reagentId: item.reagentId ?? item.reagentid,
            lotId: item.lotId ?? item.lotid,
            number: item.number,
            note: item.note ?? ''
        }))
    })
}

export let api_operation_outbound=(body)=>{
    return myrequest.post('/stock/operations/outbound',{
        "barcodeNumber": body.barcodeNumber ?? body.barcodenumber
    })
}

export let api_operation_special_outbound=(outboundList)=>{
    return myrequest.post('/stock/operations/specialOutbound',{
        "outboundList": outboundList.map(item => ({
            reagentId: item.reagentId ?? item.reagentid,
            lotId: item.lotId ?? item.lotid,
            number: item.number,
            note: item.note ?? ''
        }))
    })
}

export let api_operation_show=(body)=>{
    return myrequest.get('/stock/operations/show',{
        reagentName:body.reagentName ?? body.name,
        startTime:body.startTime ?? body.starttime,
        endTime:body.endTime ?? body.endtime,
        barcodeNumber:body.barcodeNumber ?? body.barcodenumber,
        page:body.page,
        pageSize:body.pageSize ?? body.pagesize
    })
}

export let api_operation_showall=(body={})=>{
    return myrequest.get('/stock/operations/showAll',{
        reagentName:body.reagentName ?? body.name,
        startTime:body.startTime ?? body.starttime,
        endTime:body.endTime ?? body.endtime,
        barcodeNumber:body.barcodeNumber ?? body.barcodenumber,
        page:body.page,
        pageSize:body.pageSize ?? body.pagesize
    })
}

export let api_operation_disable=(body)=>{
    return myrequest.put('/stock/operations/disable',{
        groupId:body.groupId
    })
}