import { myrequest } from "./request"

export let api_team_show=(params)=>{
    return myrequest.get('/team/show/',{
    "name":params.name,
    "page":params.page,
    "pagesize":params.pagesize
                })
}

export let api_team_del=(id)=>{
    return myrequest.put('/team/del/',{
    "id":id
                })
}


export let api_team_update=(body)=>{
    return myrequest.put('/team/update/',{
    "id":body.id,
    "name":body.name,
    "phone":body.phone,
    "note":body.note,
    "using":body.using
})
}
export let api_team_add=(body)=>{
    return myrequest.post('/team/add/',{
    "name":body.name,
    "phone":body.phone,
    "note":body.note,
    "using":body.using
})
}

