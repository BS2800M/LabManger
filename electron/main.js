// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')
const fs=require('fs')
var mainWindow=null
var printWindow=null
var listdata=null

async function read_conf(){ //读取配置和打印机
 let data=fs.readFileSync('./conf.txt').toString()
 data=JSON.parse(data)
 let printerlist = await  mainWindow.webContents.getPrintersAsync()
 data.printerlist=printerlist
 return data
}

async function saveconf(in_printername,in_select_printerid,in_allowprint) //保存配置
{
  let data= await read_conf()
  let writedata={}
  writedata.baseurl=data.baseurl
  writedata.printername=in_printername
  writedata.select_printerid=in_select_printerid
  writedata.allow_print=in_allowprint
  writedata=JSON.stringify(writedata);
  fs.writeFileSync('./conf.txt',writedata)
}




async function gotoprint(inputlistdata){  //打印数据传输给主进程 
  let printer=await read_conf()
  printOptions={deviceName:printer.printername,
    silent: true
  }
  listdata=inputlistdata
  printWindow.webContents.send('printdata_send',listdata) //将打印数据传输给printwindows

  }

function createWindow () {
  // 创建浏览器窗口
   mainWindow = new BrowserWindow({
    width: 1200,
    minWidth:1200,
    height: 800,
    minHeight:800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  printWindow = new BrowserWindow({ 
    show: false,  //隐藏窗口
    width: 500, 
    height: 300, 
    frame: true, // 禁用窗口框架，移除菜单和标题栏
    contextIsolation: false,
    enableRemoteModule: true, 
    nodeIntegration: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  ipcMain.handle('read_conf',read_conf)
  ipcMain.handle('save_printer',async (event,args1,args2,args3) =>{saveconf(args1,args2,args3)})
  ipcMain.handle('gotoprint',async(event,args)=>{gotoprint(args)}) //监听 用户界面发出准备打印的命令发送到主进程
  ipcMain.on('print', () =>{ printWindow.webContents.print(printOptions)}) //监听 printwindow渲染好的条码发送到主进程

  printWindow.loadFile('./dist/index.html', {hash: 'print'})
  // mainWindow.loadFile('./dist/index.html') 
  mainWindow.loadURL('http://localhost:3000') 
  // mainWindow.loadURL('http://localhost:3000') 
  // printWindow.loadURL('http://localhost:3000/#/print')  
  // // 打开开发工具
  mainWindow.webContents.openDevTools()
  // printWindow.webContents.openDevTools()
  mainWindow.setMenu(null);
}






app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()

  })
  mainWindow.on('close',()=>{app.quit()})
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()


})





