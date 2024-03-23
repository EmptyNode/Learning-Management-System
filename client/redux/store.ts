'use client';
import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from './features/api/apiSlice';



export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,

    },
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})
        