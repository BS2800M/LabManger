import { myrequest } from "./request"


export let api_signin=(username,password)=>{
      return myrequest.post('/identity/auth/signin',{
      "userName":username,
      "passWord":password
                  })
}

export let api_signout=()=>{
      return myrequest.get('/identity/auth/signout',{
                  })
}
