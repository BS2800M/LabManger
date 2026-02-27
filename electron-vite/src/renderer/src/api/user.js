import { myrequest } from "./request"

export let api_user_show=(params)=>{
    return myrequest.get('/user/show',{
        "name":params.name,
        "page":params.page,
        "pageSize":params.pageSize ?? params.pagesize
    })
}

export let api_user_del=(id)=>{
    return myrequest.put('/user/del',{
        "id":id
    })
}

export let api_user_add=(body)=>{
    return myrequest.post('/user/add',{
        "userName":body.userName ?? body.username,
        "passWord":body.passWord ?? body.password,
        "role":body.role,
        "teamId":body.teamId ?? body.teamid
    })
}

export let api_user_update=(body)=>{
    return myrequest.put('/user/update',{
        "id":body.id,
        "userName":body.userName ?? body.username,
        "passWord":body.passWord ?? body.password,
        "role":body.role,
        "teamId":body.teamId ?? body.teamid,
        "status":body.status
    })
}
