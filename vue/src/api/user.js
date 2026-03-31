import { myrequest } from "./request"

export let api_user_show=(params)=>{
    return myrequest.get('/identity/user/show',{
        "keyword":params.name,
        "page":params.page,
        "pageSize":params.pageSize
    })
}

export let api_user_showall=()=>{
    return myrequest.get('/identity/user/showAll')
}

export let api_user_del=(id)=>{
    return myrequest.put('/identity/user/del',{
        "id":id
    })
}

export let api_user_add=(body)=>{
    return myrequest.post('/identity/user/add',{
        "account":body.account,
        "userName":body.userName,
        "checkerPassWord":body.checkerPassWord,
        "reviewerPassWord":body.reviewerPassWord,
        "role":body.role,
        "teamId":body.teamId,
        "status":body.status
    })
}

export let api_user_update=(body)=>{
    return myrequest.put('/identity/user/update',{
        "id":body.id,
        "account":body.account,
        "userName":body.userName,
        "checkerPassWord":body.checkerPassWord,
        "reviewerPassWord":body.reviewerPassWord,
        "role":body.role,
        "teamId":body.teamId,
        "status":body.status
    })
}
