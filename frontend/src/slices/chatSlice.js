import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recentChat: localStorage.getItem('recentChat') ? JSON.parse(localStorage.getItem('recentChat')) : {
        prompt: "Hello, world",
        response: ''
    },
};

// for local storage
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.recentChat = action.payload;
            localStorage.setItem('recentChat', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.recentChat = null;
            localStorage.removeItem('recentChat');
        }
    }
});

export const { setCredentials, logout } = chatSlice.actions;

export default chatSlice.reducer;
