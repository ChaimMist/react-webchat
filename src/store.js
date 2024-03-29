import {configureStore} from '@reduxjs/toolkit';
import notificationHash from './reduxFeatures/hasMessage';
import currentSession from './reduxFeatures/currentSession';
import userInfo from './reduxFeatures/userInfo';
import socket from './reduxFeatures/Socket';
import chats from './reduxFeatures/chats';

export default configureStore({
    reducer: {
        notificationHash: notificationHash,
        currentSession: currentSession,
        userInfo: userInfo,
        socket: socket,
        chats: chats,
    },
})





