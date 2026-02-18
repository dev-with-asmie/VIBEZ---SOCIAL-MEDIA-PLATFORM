import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice" 
import postSlice from "./postSlice" 
import storySlice from "./storySlice" 
import waveSlice from "./waveSlice"
import messageSlice from "./messageSlice" 
import socketSlice from "./socketSlice";

const store = configureStore({
   reducer:{
    user: userSlice,
    post: postSlice,
    story:storySlice,
    wave: waveSlice,
    message: messageSlice,
    socket: socketSlice,


   },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 THIS LINE
    }),
})

export default store 