import {createSlice} from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name: 'userInfo', initialState: {
        name: window.location.href.includes("Chaim") ? "Chaim Mistriel" : "Dovid Mistriel",
        email: window.location.href.includes("Chaim")?"Chaimschool@gmial.com":"dovid6801@gmail.com",
        password: window.location.href.includes("Chaim")?"Chaim123":"Dovid123",
        phone: window.location.href.includes("Chaim")?"0538815816":"0587898722",
        id: window.location.href.includes("Chaim")?"1":"2",
        image: "https://chedvata.com/assets/profile.svg",
        token: "",
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.name = action.payload.name
            state.email = action.payload.email
            state.password = action.payload.password
            state.phone = action.payload.phone
            state.id = action.payload.id
            state.image = action.payload.image
            state.token = action.payload.token
        }
    }
})

export const {setUserInfo} = userInfoSlice.actions

export default userInfoSlice.reducer

