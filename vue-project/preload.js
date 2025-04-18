const {contextBridge, ipcRenderer} =require('electron')

const read_conf= ()=>{
return ipcRenderer.invoke('read_conf')
}
const saveprinterconf=(printername,selectid)=>{
return ipcRenderer.invoke('save_printer',printername,selectid)
}

const gotoprint=(listdata)=>{
return ipcRenderer.invoke('gotoprint',listdata)
}
const printdata_send=(todo)=>{
return ipcRenderer.on('printdata_send',todo)
}

const print=()=>{
    return ipcRenderer.send('print',null)
}


contextBridge.exposeInMainWorld('myapi',{read_conf,saveprinterconf,gotoprint,printdata_send,print})