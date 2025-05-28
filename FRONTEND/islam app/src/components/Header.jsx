import React from "react";
import { Clock } from 'lucide-react'

function Header () {
    return (
        <>
        <div className='bg-gradient-to-br from-blue-900 to-violet-500/20 rounded-full p-4 shadow-lg animate-pulse'>
            <Clock  size={32}/>
        </div>

        <div className='flex flex-col items-center justify-center mt-10 gap-2'>

            <h1>
                <span className=' text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent'>
                    Horaires de Prière
                </span>
            </h1>

            <span className='text-xl font-semibold text-center sm:text-xl'>Trouvez les heures de prière pour votre ville</span>

        </div>
        
        </>
    )
}

export default Header