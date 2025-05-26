
import { myrequest } from "./request"









export let api_list_Template=(searchname,pagenumber,searchteam)=>{
      return myrequest.get('/Reagent_Manger/Reagent_template/',{
      "action":"list_Template", 
      "searchname":searchname,
      "pagenumber":pagenumber,
      "searchteam":searchteam
                  })
}

export let api_delete_Template=(deleteid)=>{
      return myrequest.post('/Reagent_Manger/Reagent_template/',{
      "action":"del_Template",
      "id":deleteid
                  })
}

export let api_modify_Template=(id,name,specifications,reagent_initnumber,warn_number,price,location,warn_days,team)=>{
      return myrequest.put('/Reagent_Manger/Reagent_template/',{
      "action":"modify_Template", 
      "id":id,
      "data":{"name":name ,       
            "specifications":specifications,    
            "reagent_initnumber":reagent_initnumber,     
            "warn_number":warn_number,            
            "price":price,                   
            "location":location,
            "warn_days":warn_days,
            "team":team
                  }
            })
}

export let api_add_Template=(name,specifications,reagent_initnumber,warn_number,price,location,warn_days,is_generate_lot,team)=>{
      return myrequest.post('/Reagent_Manger/Reagent_template/',{
      "action":"add_Template", 
      "data":{"name":name ,       
            "specifications":specifications,    
            "reagent_initnumber":reagent_initnumber,     
            "warn_number":warn_number,            
            "price":price,                   
            "location":location,
            "warn_days":warn_days,
            "is_generate_lot":is_generate_lot,
            "team":team
                  }
            })
}



export let api_list_lot=(searchname,pagenumber,searchteam)=>{
      return myrequest.get('/Reagent_Manger/Reagent_Lot/',{
      "action":"list_Lot", 
      "searchname":searchname,
      "pagenumber":pagenumber,
      "searchteam":searchteam
                  })
}

export let api_list_alltemplate=(team)=>{
      return myrequest.get('/Reagent_Manger/Reagent_template/',{
      "action":"list_AllTemplate", 
      "searchteam":team
                  })
}

export let api_delete_lot=(deleteid)=>{
      return myrequest.post('/Reagent_Manger/Reagent_Lot/',{
      "action":"del_Lot",
      "id":deleteid
                  })
}


export let api_modify_lot=(id,reagentid,lot,Expiration_date)=>{
      return myrequest.put('/Reagent_Manger/Reagent_Lot/',{
      "action":"modify_Lot",
      "id":id,
      "data":{
            "reagentid":reagentid ,      
            "lot":lot,    
            "Expiration_date":Expiration_date,   
        }
                  })
}


export let api_add_lot=(reagentid,lot,Expiration_date)=>{
      return myrequest.post('/Reagent_Manger/Reagent_Lot/',{
      "action":"add_Lot",
      "data":{
            "reagentid":reagentid ,      
            "lot":lot,    
            "Expiration_date":Expiration_date,   
        }
                  })
}

export let api_list_alllot=(search_reagentid)=>{
      return myrequest.get('/Reagent_Manger/Reagent_Lot/',{
            "action":"list_AllLot",
            "search_reagentid":search_reagentid,
                        })
      }


export let api_inbound=(listdata)=>{
            return myrequest.post('/Reagent_Manger/Reagent_Operation/',{
                  "action":"inbound",
                  "listdata":listdata,
                  })
            }


export let api_outbound=(barcodenumber)=>{
                  return myrequest.post('/Reagent_Manger/Reagent_Operation/',{
                        "action":"outbound",
                        "barcodenumber":barcodenumber

                        })
                  }

export let api_special_outbound=(outnumber,outreagentid,outlotid)=>{
      return myrequest.post('/Reagent_Manger/Reagent_Operation/',{
            "action":"special_outbound",
            "outnumber":outnumber,
            "outreagentid":outreagentid,
            "outlotid":outlotid
            })
      }      




export let api_list_operation=(searchname_operation,searchlater_operation,searchearlier_operation,pagenumber,barcodenumber,searchteam)=>{
      return myrequest.get('/Reagent_Manger/Reagent_Operation/',{
                        "action":"list_operation",     
                        "searchname_operation":searchname_operation,
                        "searchlater_operation":searchlater_operation,
                        "searchearlier_operation":searchearlier_operation,
                        "pagenumber":pagenumber,
                        "barcodenumber":barcodenumber,
                        "searchteam":searchteam
            })
      }

export let api_delete_operation=(deleteid)=>{
      return myrequest.post('/Reagent_Manger/Reagent_Operation/',{
            "action":"delete_operation",
            "id":deleteid
            })
      }

export let api_list_reagentnumber=(only_showwarn,pagenumber,searchteam)=>{
      return myrequest.get('/Reagent_Manger/Reagent_Operation/',{
            "action":"list_reagentnumber",  
            "only_showwarn":only_showwarn,
            "pagenumber":pagenumber,
            "searchteam":searchteam,
            })
      }

export let api_refresh_reagent=()=>{
      return myrequest.put('/Reagent_Manger/Reagent_Operation/',{
            "action":"refresh_reagent"
            })
      }