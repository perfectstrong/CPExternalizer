const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let window;

function createWindow() {
    window = new BrowserWindow({width: 800, height: 600});
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    window.webContents.openDevTools();
    window.on('closed', () => {
        window = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});