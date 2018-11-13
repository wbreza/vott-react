import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import url from 'url';
import menuTemplate from './menu.json';
import Store from './store/store';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let store;

function createWindow() {
    // Create the browser window.
    store = Store.create();
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

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function onMenuAction(action) {
    store.dispatch(action);
}

function bindMenuActions(template) {
    template.forEach(item => {
        if (item.submenu) {
            bindMenuActions(item.submenu);
        }

        if (item.id) {
            item.click = (menuItem, browserWindow, event) => {
                if (item.target === 'renderer') {
                    browserWindow.webContents.send('MENU_ACTION', menuItem);
                } else {
                    onMenuAction({ type: item.action, menuItem, browserWindow, event });
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