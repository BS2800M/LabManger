import { myrequest } from "./request"


export let api_signin=(username,password)=>{
      return myrequest.post('/auth/signin',{
      "userName":username,
      "passWord":password
                  })
}

export let api_signout=()=>{
      return myrequest.get('/auth/signout',{
                  })
}
