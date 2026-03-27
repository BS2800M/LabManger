import { myrequest } from './request'

export let api_sensorRecord_show=(params)=>{
    return myrequest.get('/sensorMonitor/sensorRecord/show',{
        locationName:params.locationName,
        startTime:params.startTime,
        endTime:params.endTime,
        page:params.page,
        pageSize:params.pageSize
    })
}

export let api_sensorRecord_showAll=(params)=>{
    return myrequest.get('/sensorMonitor/sensorRecord/showAll',{
        locationName:params.locationName,
        startTime:params.startTime,
        endTime:params.endTime,
        page:params.page,
        pageSize:params.pageSize
    })
}

export let api_sensorRecord_add=(body)=>{
    return myrequest.post('/sensorMonitor/sensorRecord/add',{
        data:[{
            locationId:body.locationId,
            temperature:body.temperature,
            humidity:body.humidity,
            createTime:body.createTime,
            battery:body.battery,
        }]
    })
}

export let api_sensorRecord_update=(body)=>{
    return myrequest.put('/sensorMonitor/sensorRecord/update',{
        id:body.id,
        locationId:body.locationId,
        temperature:body.temperature,
        humidity:body.humidity,
        createTime:body.createTime,
        battery:body.battery,
    })
}

export let api_sensorRecord_del=(id)=>{
    return myrequest.put('/sensorMonitor/sensorRecord/del',{
        id:id
    })
}

