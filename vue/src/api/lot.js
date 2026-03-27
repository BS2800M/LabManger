import { myrequest } from './request'

export let api_lot_show=(params)=>{
    return myrequest.get('/stock/lots/show',{
        name:params.name,
        page:params.page,
        pageSize:params.pageSize
    })
}

export let api_lot_del=(id)=>{
    return myrequest.put('/stock/lots/del',{
        "id":id
    })
}

export let api_lot_update=(body)=>{
    return myrequest.put('/stock/lots/update',{
        id:body.id,
        reagentId:body.reagentid ?? body.reagentId,
        name:body.name,
        expirationDate:body.expirationdate ?? body.expirationDate,
        status:body.status
    })
}

export let api_lot_add=(body)=>{
    return myrequest.post('/stock/lots/add',{
        name:body.name,
        reagentId:body.reagentid ?? body.reagentId,
        expirationDate:body.expirationdate ?? body.expirationDate
    })
}

export let api_lot_showall=(reagentId)=>{
    return myrequest.get('/stock/lots/showAll',{
        reagentId:reagentId
    })
}
