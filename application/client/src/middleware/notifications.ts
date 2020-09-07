import { StatusAction, StatusActionTypes } from '../actions/status-actions';
import { Actions } from '../actions/types';
import { Middleware } from 'redux';

import { notification } from 'antd';

// @ts-ignore
global.notification = notification;

const handleStarted = (actionType: StatusActionTypes) => {

};

const handleFinished = (actionType: StatusActionTypes) => {
    switch (actionType) {
        case StatusActionTypes.CREATE_QUEUE:
            notification.success({
                message: 'Queue successfully created!',
                description: 'All good to go, your queue has been created. Don\'t forget to configure rooms that will serve your new queue!',
            });
            break;
        case StatusActionTypes.REMOVE_QUEUE:
            notification.success({
                message: 'Queue successfully removed!',
            });
            break;
    }
};

const handleFailed = (actionType: StatusActionTypes) => {
    switch (actionType) {
        case StatusActionTypes.REMOVE_QUEUE:
            break;
    }
};

export const notifications: Middleware = store => next => (action: Actions) => {
    if (Object.values(StatusActionTypes).includes(action.type)) {
        const actionType = action.type as StatusActionTypes;

        switch ((action as StatusAction).payload.status) {
            case 'started':
                handleStarted(actionType);
                break;
            case 'failed':
                handleFailed(actionType);
                break;
            case 'finished':
                handleFinished(actionType);
                break;
        }
    }

    return next(action);
};
