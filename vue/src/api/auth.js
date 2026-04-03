import { myrequest } from "./request"


export let api_signin_reviewer=(account,password)=>{
      return myrequest.post('/identity/auth/signin-reviewer',{
      "account":account,
      "passWord":password
                  })
}

export let api_signin_checker=(account,password,reviewerSessionId)=>{
      return myrequest.post('/identity/auth/signin-checker',{
      "account":account,
      "passWord":password,
      "reviewerSessionId":reviewerSessionId
                  })
}

export let api_signout=(sessionId)=>{
      return myrequest.get('/identity/auth/signout',{
      "sessionId":sessionId
                  })
}
