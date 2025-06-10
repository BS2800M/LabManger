import { myrequest } from "./request"


export let api_login=(username,password)=>{
      return myrequest.get('/loginout/login/',{
      "username":username,
      "password":password
                  })
}

export let api_logout=(username)=>{
      return myrequest.get('/loginout/logout/',{
        "username":username,
                  })
}