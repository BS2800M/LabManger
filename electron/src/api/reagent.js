import { myrequest } from "./request"


export let api_reagent_show=(params)=>{
    return myrequest.get('/reagent/show/',{
        teamid:params.teamid,
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
        warn_number:body.warn_number,
        price:body.price,
        storage_condition:body.storage_condition,
        teamid:body.teamid,
        warn_days:body.warn_days,
        using:body.using,   
    })
}


export let api_reagent_add=(body)=>{
    return myrequest.post('/reagent/add/',{
        name:body.name,
        specifications:body.specifications,
        warn_number:body.warn_number,
        price:body.price,
        storage_condition:body.storage_condition,
        teamid:body.teamid,
        warn_days:body.warn_days,
        using:body.using,
        generate_lot:body.generate_lot
    })
}

export let api_reagent_showall=(teamid)=>{
    return myrequest.get('/reagent/showall/',{
    teamid:teamid
                })
}