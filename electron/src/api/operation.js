import { myrequest } from './request'
export let api_operation_inbound=(inboundlist)=>{
    return myrequest.post('/operation/inbound/',{
          "inboundlist":inboundlist,
          
          })
    }


export let api_operation_outbound=(body)=>{
          return myrequest.post('/operation/outbound/',{
                barcodenumber:body.barcodenumber,
                userid:body.userid,
                })
          }

export let api_operation_special_outbound=(body)=>{
return myrequest.post('/operation/special_outbound/',{
    outboundlist:body
    })
}      




export let api_operation_show=(body)=>{
return myrequest.get('/operation/show/',{
    teamid:body.teamid,
    reagentname:body.reagentname,
    searchlater:body.searchlater,
    searchearlier:body.searchearlier,
    barcodenumber:body.barcodenumber,
    page:body.page,
    pagesize:body.pagesize
    })
}

export let api_operation_del=(deleteid)=>{
return myrequest.put('/operation/del/',{
    id:deleteid
    })
}