import { myrequest } from './request'

export let api_operation_inbound=(inboundList)=>{
    return myrequest.post('/stock/operations/inbound',{
        "inboundList": inboundList.map(item => ({
            reagentId: item.reagentId,
            lotId: item.lotId,
            number: item.number,
            note: item.note ?? ''
        }))
    })
}

export let api_operation_fast_inbound=(body)=>{
    return myrequest.post('/stock/operations/fastInbound',{
        "udi": body.udi,
        "note": body.note ?? ''
    })
}

export let api_operation_fast_outbound=(body)=>{
    return myrequest.post('/stock/operations/fastOutbound', {
        useUdi: body.useUdi,
        udi: body.udi,
        barcodeNumber: body.barcodeNumber,
        note: body.note ?? ''
    })
}

export let api_operation_outbound=(outboundList)=>{
    return myrequest.post('/stock/operations/Outbound',{
        "outboundList": outboundList.map(item => ({
            reagentId: item.reagentId,
            lotId: item.lotId,
            number: item.number,
            note: item.note ?? ''
        }))
    })
}

export let api_operation_show=(body)=>{
    return myrequest.get('/stock/operations/show',{
        reagentName:body.reagentName,
        barcodeNumber:body.barcodeNumber,
        udi:body.udi,
        startTime:body.startTime,
        endTime:body.endTime,
        page:body.page,
        pageSize:body.pageSize
    })
}

export let api_operation_showall=(body={})=>{
    return myrequest.get('/stock/operations/showAll',{
        reagentName:body.reagentName,
        barcodeNumber:body.barcodeNumber,
        udi:body.udi,
        startTime:body.startTime,
        endTime:body.endTime,
        page:body.page,
        pageSize:body.pageSize
    })
}

export let api_operation_disable=(body)=>{
    return myrequest.put('/stock/operations/disable',{
        batchId:body.batchId
    })
}
