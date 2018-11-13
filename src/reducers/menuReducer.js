import * as ActionTypes from '../actions/actionTypes';
import { dialog } from 'electron';

export const menuReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_DEV_TOOLS:
            toggleDevTools(action.menuItem, action.browserWindow);
            return Object.assign({}, state, { devToolsEnabled: action.menuItem.checked });
        case ActionTypes.OPEN_LOCAL_FOLDER:
            openLocalFolder();
            return Object.assign({}, state, { openLocalFolder: true });
        default:
            return state;
    }
}

function openLocalFolder(menuItem) {
    return dialog.showOpenDialog({
        title: 'Open Images Directory',
        properties: ['openDirectory']
    });
}

function toggleDevTools(menuItem, browserWindow) {
    if (menuItem.checked) {
        browserWindow.webContents.openDevTools();
    } else {
        browserWindow.webContents.closeDevTools();
    }
}