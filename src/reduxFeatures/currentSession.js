import {createSlice} from "@reduxjs/toolkit";

export const currentSessionSlice = createSlice(
    {
        name: 'currentSession',

        initialState: {
            obj: {
                chatID: "system",
                chatName: "system",
                image: "https://chedvata.com/assets/profile.svg",
                updated_at: "12:00",
                messages: [{
                    sender:"System",
                    user_id: "9999",
                    message: "Welcome to web chat where you can add groups and invite friends to get real time texts.",
                    created_at: "12:00"
                }],
            }
        },
        reducers: {
            setCurrentSession: (state, action) => {
                state.obj = action.payload
            },
            addMessage: (state, action) => {
                state.obj.messages.push(action.payload)
            },
            setMessage: (state, action) => {
                state.obj.messages = action.payload
            }
        }
    }
)

export const {setCurrentSession, addMessage, setMessage} = currentSessionSlice.actions

export default currentSessionSlice.reducer


