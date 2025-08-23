import { myrequest } from "./request"


export let api_signin=(username,password)=>{
      return myrequest.post('/signinout/signin/',{
      "username":username,
      "password":password
                  })
}

export let api_signout=(username)=>{
      return myrequest.get('/signinout/signout/',{
                  })
}