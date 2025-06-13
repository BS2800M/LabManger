interface UserAddRequestBody{
    username:string,
    password:string,
    permission:string,
    teamid:number
}

interface UserDelRequestBody{
    id:number
}

export {UserAddRequestBody,UserDelRequestBody}