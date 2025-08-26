import { myrequest } from './request'

export let api_lot_show=(params)=>{
    return myrequest.get('/lot/show/',{
        name:params.name,
        page:params.page,
        pagesize:params.pagesize
                })
}



export let api_lot_del=(id)=>{
    return myrequest.put('/lot/del/',{
    "id":id
                })
}


export let api_lot_update=(body)=>{
    return myrequest.put('/lot/update/',{
        id:body.id,
        reagentid:body.reagentid,
        name:body.name,
        expirationdate:body.expirationdate,
        active:body.active
                })
}

export let api_lot_add=(body)=>{
    return myrequest.post('/lot/add/',{
        name:body.name,
        reagentid:body.reagentid,
        expirationdate:body.expirationdate,
        active:body.active
                })
}

export let api_lot_showall=(params)=>{
    return myrequest.get('/lot/showall/',{
        reagentid:params.reagentid
                })
}
