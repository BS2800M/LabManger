import { myrequest } from "./request"

export let api_location_show=(params)=>{
    return myrequest.get('/sensorMonitor/locations/show',{
        name:params.name,
        page:params.page,
        pageSize:params.pageSize
    })
}

export let api_location_del=(id)=>{
    return myrequest.put('/sensorMonitor/locations/del',{
        id:id
    })
}

export let api_location_update=(body)=>{
    return myrequest.put('/sensorMonitor/locations/update',{
        id:body.id,
        name:body.name,
        note:body.note,
        uploadIntervalMinutes:body.uploadIntervalMinutes,
        maxTemperature:body.maxTemperature,
        minTemperature:body.minTemperature,
        maxHumidity:body.maxHumidity,
        minHumidity:body.minHumidity,
        status:body.status,
    })
}

export let api_location_add=(body)=>{
    return myrequest.post('/sensorMonitor/locations/add',{
        name:body.name,
        note:body.note,
        uploadIntervalMinutes:body.uploadIntervalMinutes,
        maxTemperature:body.maxTemperature,
        minTemperature:body.minTemperature,
        maxHumidity:body.maxHumidity,
        minHumidity:body.minHumidity,
        status:body.status,
    })
}
export let api_location_showAll=()=>{
    return myrequest.get('/sensorMonitor/locations/showAll',{
    })
}