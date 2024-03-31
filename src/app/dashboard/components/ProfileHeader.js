'use client'

import { useEffect, useState } from 'react';
import Image from "next/image";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { useFetchData } from "./../../../services/fetcher"

export default function ProfileHeader() {
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false);
    const [token, setToken] = useState('');
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const { data, count, error, isLoading } = useFetchData(token, 'user');

    const handleLogout = async () => {
        const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + "/api/logout",{}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        if(response.data.status == true){
            localStorage.removeItem('authToken');
            
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    }

    console.log(data)

    return (
        <header className="h-16 flex items-center justify-between m-4 mb-0">
            <div className="flex gap-2 items-center">
                <div className="size-12 relative rounded-lg overflow-hidden">
                    <Image src="/images/dummy-company.png" alt="dummy company" fill={true} />
                </div>
                <div>
                    <p className="text-xs">PROJECT</p>
                    <p className="text-lg">{!isLoading && data && (data.company)}</p>
                </div>
            </div>

            <div className="flex gap-2 items-center relative">
                <div>
                    <p className="text-xs uppercase text-right">Profile</p>
                    <p className="text-xs uppercase text-right">{!isLoading && data && (data.email)}</p>
                    <p className="text-base hover:underline cursor-pointer text-right" onClick={toggleDropdown}>{!isLoading && data && (data.name)}</p>
                </div>
                <div className="size-12 relative rounded-full overflow-hidden border-4 border-emerald-600 border-opacity-20 cursor-pointer" onClick={toggleDropdown}>
                    <Image src="/images/dummy-profile.png" alt="dummy company" fill={true} />
                </div>

                {showDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 shadow-md rounded-md">
                        <div className="py-1">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
