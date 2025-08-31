
import { myrequest } from "./request"



export const api_inventory_show=(params)=>{
      return myrequest.get('/inventory/show/',{
            reagentname:params.reagentname,
            page:params.page,
            pagesize:params.pagesize,
            })
      }

export const api_inventory_auditall=(params)=>{
      return myrequest.put('/inventory/auditall/',{
      })
}

export const api_inventory_dashboard=(params)=>{
      return myrequest.get('/inventory/dashboard/',{
      })
}

export const api_inventory_statistics=(params)=>{
      return myrequest.get('/inventory/statistics/',{
            reagentid:params.reagentId,
            lotid:1,
            starttime:params.starttime,
            endtime:params.endtime,
            intervalday:params.intervalday,
      })
}






      