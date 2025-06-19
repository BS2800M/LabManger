interface UserAddRequestBody{
    username:string,
    password:string,
    role:string,
    teamid:number
}

interface UserDelRequestBody{
    id:number
}

interface UserShowRequestBody{
    name:string,
    page:number,
    pagesize:number
}

interface UserUpdateRequestBody{
    id:number,
    username:string,
    role:string,
    teamid:number,
    password:string
}

export {UserAddRequestBody,UserDelRequestBody,UserShowRequestBody,UserUpdateRequestBody}