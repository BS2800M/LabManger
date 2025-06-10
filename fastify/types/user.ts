interface UserAddRequestBody{
    username:string,
    password:string,
    permission:string
}

interface UserDelRequestBody{
    id:number
}

export {UserAddRequestBody,UserDelRequestBody}