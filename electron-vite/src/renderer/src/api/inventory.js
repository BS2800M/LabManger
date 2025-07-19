
import { myrequest } from "./request"



export const api_inventory_show=(params)=>{
      return myrequest.get('/inventory/show/',{
            page:params.page,
            pagesize:params.pagesize,
            })
      }

export const api_inventory_audit=(params)=>{
      return myrequest.put('/inventory/audit/',{
            reagentid:params.reagentid,   
            lotid:params.lotid,
      })
}
      