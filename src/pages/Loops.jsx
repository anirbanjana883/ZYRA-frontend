import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import LoopCard from '../components/LoopCard';
import { useSelector } from "react-redux";

function Loops() {
    const navigate = useNavigate()
    const {loopData} = useSelector(state => state.loop)

    return (
        <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>

            {/* Top Navigation */}
            <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
                <IoArrowBack
                    size={30}
                    className="text-white cursor-pointer hover:text-gray-300"
                    onClick={() => navigate(`/`)}
                />
                <h1 className="text-white text-[20px] font-semibold">Loops</h1>
            </div>

            {/* Loops List */}
            <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
                {loopData.length > 0 ? ( // CHANGED: added check for empty array
                    loopData.map((loop) => ( // CHANGED: replaced index key with loop._id
                        <div className='h-screen snap-start' key={loop._id}> {/* CHANGED: key */}
                            <LoopCard loop={loop} /> 
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full text-white text-xl"> {/* ADDED: empty state */}
                        No loops available.
                    </div>
                )}
            </div>

        </div>
    )
}

export default Loops
