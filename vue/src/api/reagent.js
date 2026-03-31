import { myrequest } from "./request"

export let api_reagent_show=(params)=>{
    return myrequest.get('/stock/reagents/show',{
        name:params.name,
        page:params.page,
        pageSize:params.pageSize
    })
}

export let api_reagent_del=(id)=>{
    return myrequest.put('/stock/reagents/del',{
        id:id
    })
}

export let api_reagent_update=(body)=>{
    return myrequest.put('/stock/reagents/update',{
        id:body.id,
        name:body.name,
        di:body.di,
        specifications:body.specifications,
        warnNumber:body.warnNumber,
        price:body.price,
        storageCondition:body.storageCondition,
        warnDays:body.warnDays,
        status:body.status,
        note:body.note,
        manufacturer:body.manufacturer
    })
}

export let api_reagent_add=(body)=>{
    return myrequest.post('/stock/reagents/add',{
        name:body.name,
        di:body.di,
        specifications:body.specifications,
        warnNumber:body.warnNumber,
        price:body.price,
        storageCondition:body.storageCondition,
        warnDays:body.warnDays,
        generateLot:body.generateLot,
        note:body.note,
        manufacturer:body.manufacturer
    })
}

export let api_reagent_showall=()=>{
    return myrequest.get('/stock/reagents/showAll',{})
}
