import { myrequest } from "./request"

export let api_user_show=(params)=>{
    return myrequest.get('/user/show/',{
        "name":params.name,
        "page":params.page,
        "pagesize":params.pagesize
                })
}

export let api_user_del=(id)=>{
    return myrequest.put('/user/del/',{
        "id":id
                })
}


export let api_user_add=(body)=>{
    return myrequest.post('/user/add/',{
        "username":body.username,
        "password":body.password,
        "role":body.role,
        "teamid":body.teamid
    })
}

export let api_user_update=(body)=>{
    return myrequest.put('/user/update/',{
        "id":body.id,
        "username":body.username,
        "role":body.role,
        "teamid":body.teamid,
        "password":body.password
    })
}
    