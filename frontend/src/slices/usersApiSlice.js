import { apiSlice } from "./apiSlice";
// import dotenv from 'dotenv';

// dotenv.config();

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `/api/users/login`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `/api/users/`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `/api/users/logout`,
                method: 'POST',
            })
        }),
        sendPrompt: builder.mutation({
            query: (data) => ({
                url: `/api/users/chat`,
                method: 'POST',
                body: data
            }),
        }),
        getChatHistory: builder.mutation({
            query: () => ({
                url: `/api/users/history`,
                method: 'GET',
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/users/profile`,
                method: 'PUT',
                body: data
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useSendPromptMutation,
    useGetChatHistoryMutation } = usersApiSlice;