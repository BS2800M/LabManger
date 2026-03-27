import { myrequest } from "./request"

export let api_user_show=(params)=>{
    return myrequest.get('/identity/user/show',{
        "name":params.name,
        "page":params.page,
        "pageSize":params.pageSize ?? params.pagesize
    })
}

export let api_user_del=(id)=>{
    return myrequest.put('/identity/user/del',{
        "id":id
    })
}

export let api_user_add=(body)=>{
    return myrequest.post('/identity/user/add',{
        "userName":body.userName ?? body.username,
        "passWord":body.passWord ?? body.password,
        "role":body.role,
        "teamId":body.teamId ?? body.teamid
    })
}

export let api_user_update=(body)=>{
    return myrequest.put('/identity/user/update',{
        "id":body.id,
        "userName":body.userName ?? body.username,
        "passWord":body.passWord ?? body.password,
        "role":body.role,
        "teamId":body.teamId ?? body.teamid,
        "status":body.status
    })
}
