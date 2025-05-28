import React from 'react'
import { Input } from "@/components/ui/input"

export default function SearchInput(search, setSearch, setError, setValue, setPrayerTimes) {

    return (
    <>
        <div className=''>

    

            <Input
                className='w-full sm:w-96 h-12'
                type="text" 
                placeholder='Rechercher une ville...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => {
                    setError('');
                    setValue('');
                    setPrayerTimes(null);   

                    }
                }
                    

            />
        </div>  
    </>
    )
}
