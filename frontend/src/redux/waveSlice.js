import { createSlice } from "@reduxjs/toolkit"
const waveSlice = createSlice({
    name: "wave",
    initialState:{
    waveData: [],
    

   },
   reducers:{
    setWaveData:(state,action)=>{
        state.waveData = action.payload

    
    

    }


   }

})

export const {setWaveData} = waveSlice.actions 
export default waveSlice.reducer 