import {createSlice} from '@reduxjs/toolkit';
import io from 'socket.io-client';


const socket = io('http://localhost:3001');
socket.on('open', () => {
    console.log('Connected to server');
});
socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
});
socket.on('close', () => {
    console.log('Disconnected from server');
});



export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: socket,
    },
    reducers: {

        dispatchEvent: (state, action) => {
            state.socket.emit(action.payload[0], action.payload[1])
            console.log("dispatched event " + action.payload[0] + " with payload " + action.payload[1])
        }
    }
})

export const {dispatchEvent} = socketSlice.actions

export default socketSlice.reducer
