import React from 'react'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import WaveCard from '../components/WaveCard';
import { useSelector } from 'react-redux';
function Waves () {
    const navigate = useNavigate() 
    const {waveData} = useSelector(state=>state.wave) 
    return (
        <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center' > 

          <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px]'> 
                     <MdKeyboardBackspace className='text-white cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate(`/`)}/>
                     <h1 className='text-white text-[20px] font-semibold'>Waves</h1>  
                     </div>

                     <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'> 
                          {/*waveData.map((wave,index)=>(
                            <div className='h-screen snap-start'>
                            <WaveCard wave={wave} key={indexedDB}/>
                            </div>
                          ))*/} 
                          {waveData?.map((wave) => (
                            <div key={wave._id} className='h-screen snap-start'>
                           <WaveCard wave={wave} />
                            </div>
                          ))}

                     </div>

                     

        </div>

        
    )
}
export default Waves 