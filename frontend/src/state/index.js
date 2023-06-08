import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, aciton) => {
            state.user = aciton.payload.user;
            state.token = aciton.payload.token;
        },
        setLogout: (state, action) => {
            state.user = null;
            state.token = null;
        },
    },
});


export const {setLogin, setLogout}= authSlice.actions;
export default authSlice.reducer;