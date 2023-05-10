import {createSlice} from "@reduxjs/toolkit";

export const chatsSlice = createSlice({
    name: 'chats',
    initialState: {chats: []},

    reducers: {
        addChat: (state, action) => {
            state.chats.push(action.payload)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        }
    }
})

export const {addChat, setChats} = chatsSlice.actions

export default chatsSlice.reducer