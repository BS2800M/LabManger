interface LoginRequestBody{
    username:string,
    password:string
}

interface LogoutRequestBody{
    username:string
}

export {LoginRequestBody,LogoutRequestBody}