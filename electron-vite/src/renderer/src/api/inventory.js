import { myrequest } from "./request"

export const api_inventory_show=(params)=>{
    return myrequest.get('/inventory/show',{
        name:params.reagentname ?? params.name,
        page:params.page,
        pageSize:params.pageSize ?? params.pagesize
    })
}

export const api_inventory_showall=(params={})=>{
    return myrequest.get('/inventory/showAll',{
        name:params.reagentname ?? params.name,
        page:params.page,
        pageSize:params.pageSize ?? params.pagesize
    })
}

export const api_inventory_auditall=()=>{
    return myrequest.post('/inventory/auditAll',{})
}

export const api_inventory_dashboard=()=>{
    return Promise.resolve({ success: false, data: null })
}

export const api_inventory_statistics=(params)=>{
    return myrequest.get('/inventory/statistics',{
        onlyLot:params.onlyLot ?? params.onlylot,
        reagentId:params.reagentId,
        lotId:params.lotId,
        startTime:params.startTime ?? params.starttime,
        endTime:params.endTime ?? params.endtime,
        intervalDay:params.intervalDay ?? params.intervalday
    })
}
