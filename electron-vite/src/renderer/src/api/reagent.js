import { myrequest } from "./request"


export let api_reagent_show=(params)=>{
    return myrequest.get('/reagent/show/',{
        name:params.name,
        page:params.page,
        pagesize:params.pagesize
                })
}

export let api_reagent_del=(id)=>{
    return myrequest.put('/reagent/del/',{
        id:id
                })
}

export let api_reagent_update=(body)=>{
    return myrequest.put('/reagent/update/',{
        id:body.id,
        name:body.name,
        specifications:body.specifications,
        warnNumber:body.warnNumber,
        price:body.price,
        storageCondition:body.storageCondition,
        warnDays:body.warnDays,
        active:body.active,   
        note:body.note,
        manufacturer:body.manufacturer
        
    })
}


export let api_reagent_add=(body)=>{
    return myrequest.post('/reagent/add/',{
        name:body.name,
        specifications:body.specifications,
        warnNumber:body.warnNumber,
        price:body.price,
        storageCondition:body.storageCondition,
        warnDays:body.warnDays,
        active:body.active,   
        generateLot:body.generateLot,
        note:body.note,
        manufacturer:body.manufacturer

    })
}

export let api_reagent_showall=()=>{
    return myrequest.get('/reagent/showall/',{
                })
}



