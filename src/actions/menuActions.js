import * as ActionTypes from './actionTypes';
import { dialog } from 'electron';

function toggleDevToolsSuccess(menuItem) {
    return { type: ActionTypes.toggleDevTools, menuItem };
}

export function toggleDevTools(menuItem) {
    return (dispatch) => {
        dispatch(toggleDevToolsSuccess(menuItem));
    }
}