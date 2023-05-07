import {createSlice} from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name: 'userInfo', initialState: {
        name: "Chaim Mistriel",
        email: "Chaimschool@gmial.com",
        password: "Chaim123",
        phone: "0538815816",
        id: "1",
        image: "https://chedvata.com/assets/profile.svg",
        token: "",
    }
})

export default userInfoSlice.reducer

