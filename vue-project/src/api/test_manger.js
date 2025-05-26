
import { myrequest } from "./request"









export let api_list_Team=(searchname,pagenumber)=>{
      return myrequest.get('/Test_Manger/Test_Team/',{
      "action":"list_Team", 
      "searchname":searchname,
      "pagenumber":pagenumber
                  })
}

export let api_delete_Team=(deleteid)=>{
      return myrequest.post('/Test_Manger/Test_Team/',{
      "action":"del_Team",
      "id":deleteid
                  })
}


export let api_modify_Team=(id,name,phone,long_info)=>{
      return myrequest.put('/Test_Manger/Test_Team/',{
      "action":"modify_Team", 
      "id":id,
      "data":{"name":name ,       
            "phone":phone,
            "long_info":long_info,
            }
            })
}
export let api_add_Team=(name,phone,long_info)=>{
      return myrequest.post('/Test_Manger/Test_Team/',{
      "action":"add_Team", 
      "data":{"name":name ,       
            "phone":phone,
            "long_info":long_info,
            }
            })
}

export let api_list_ALLTeam=()=>{
      return myrequest.post('/Test_Manger/Test_Team/',{
            "action":"list_ALLTeam",
                        })
}