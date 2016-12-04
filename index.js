const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')



//Keep a global reference of the window object, if you do not, the window will be closed automatically when the JavaScript object is garbage coolected.
let win

function createWindow (){
  	//Create the browser window
    win = new BrowserWindow({width: 800, height: 600})

    //And load the index.html of the app
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))

    //Open the DevTools
    win.webContents.openDevTools()

    //Emited when the window is closed
    win.on('closed', () => {
      //Dereference the window object, usually you would store windows
      //in a array if your app supports multi windows, this is the time
      //when you should delete the corresponding element.
      win = null
    })
}

//This metod will be called when Electron has finished
//initialization and is ready to create browser windows.
//Some APIs can only be used after this event occurs
app.on('ready', createWindow)


//Quit when all windows are closed
app.on('window--all-closed', () => {
  //On macOS it is common for applications and their manu bar
  //to stay active until the user quits explicitly with Cmd+Q
  if(win == null){
    createWindow()
  }
})

//In this file you can include the rest of your app's specific main process
//code. You can also put them in separate files and require them here.
