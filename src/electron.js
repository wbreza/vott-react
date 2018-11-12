const electron = require('electron');
const path = require('path');
const url = require('url');
const menuTemplate = require('./menu.json');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    createMenu();

    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    electron.ipcMain.on('MENU_ACTION', onMenuAction);

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

function createMenu() {
    const template = [].concat(menuTemplate);
    bindMenuActions(template);

    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
}

function onMenuAction(sender, args) {
    switch (args.id) {
        case 'developerConsole':
            mainWindow.webContents.openDevTools();
            break;
        default:
            console.log(`No handler found for ${args.id}`);
            break;
    }
}

function bindMenuActions(template) {
    template.forEach(item => {
        if (item.submenu) {
            bindMenuActions(item.submenu);
        }

        if (item.id) {
            item.click = () => {
                if (item.target === 'renderer') {
                    mainWindow.webContents.send('MENU_ACTION', item);
                } else {
                    require('electron').ipcMain.send('MENU_ACTION', item);
                }
            };
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.