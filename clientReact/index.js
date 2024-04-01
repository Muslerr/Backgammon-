const {app,BrowserWindow,ipcMain}=  require('electron');
const Store = require('electron-store');
const store = new Store();

ipcMain.on('store-token', (event, token) => {
  store.set('token', token); // Store the token
  event.sender.send('token-stored'); // Acknowledge that the token is stored
});

ipcMain.on('get-token', (event) => {
  const token = store.get('token', ''); // Retrieve the token
  event.returnValue = token; // Send the token back to the renderer process
});
let mainWindow;

app.on("ready",()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
        }
    });
    mainWindow.loadURL(`${app.getAppPath()}\\build\\index.html`)
});
ipcMain.on("number",(event,value)=>{
    console.log(value);
})
