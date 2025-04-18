import { myrequest } from "./request"




export let api_signin=(username,password)=>{
      return myrequest.post('/signin/',{
      "username":username,
      "password":password
                  })
}

export let api_signout=()=>{
      return myrequest.post('/signout/',{
                  })
}