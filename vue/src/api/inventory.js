import { myrequest } from "./request"

export const api_inventory_show=(params)=>{
    return myrequest.get('/stock/inventory/show',{
        name:params.name,
        page:params.page,
        pageSize:params.pageSize
    })
}

export const api_inventory_showall=(params={})=>{
    return myrequest.get('/stock/inventory/showAll',{
        name:params.name,
        page:params.page,
        pageSize:params.pageSize
    })
}

export const api_inventory_auditall=()=>{
    return myrequest.post('/stock/inventory/auditAll',{})
}

export const api_inventory_dashboard=()=>{
    return Promise.resolve({ success: false, data: null })
}



export const api_inventory_statistics=(params)=>{
    const onlyLot = params.onlyLot === true
    return myrequest.get('/stock/inventory/statistics',{
        onlyLot,
        reagentId:params.reagentId,
        lotId:params.lotId,
        startTime:params.startTime,
        endTime:params.endTime,
        intervalDay:params.intervalDay
    })
}
