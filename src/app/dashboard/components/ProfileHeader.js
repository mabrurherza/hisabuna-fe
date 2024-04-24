'use client'

import { useEffect, useState } from 'react';
import Image from "next/image";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { useFetchData } from "./../../../services/fetcher"

function ModalProfile({ closeProfile, dataProfile, token }) {
    // const listInput = ['no_akun', 'nama_akun', 'saldo_awal_debit', 'saldo_awal_credit', 'arus_kas', 'anggaran'];
    // const [formData, setFormData] = useState({});
    const [data, setData] = useState(dataProfile)
    console.log(data)

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const noAkun = formData.no_akun;
    //     const found = dataCOA.some(coa => coa.akun_no === noAkun);
    //     if (found) {
    //         alert("Data sudah ada dalam dataCOA");
    //     } else {
    //         const addForm = {
    //             akun_no: formData.no_akun,
    //             akun_nama: formData.nama_akun,
    //             saldo_awal_debit: formData.saldo_awal_debit,
    //             saldo_awal_credit: formData.saldo_awal_credit,
    //             arus_kas: formData.arus_kas,
    //             anggaran: formData.anggaran
    //         }
    //         try {
    //             const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + '/api/coa/add', addForm, {
    //                 headers: {
    //                     "Content-Type": "application/x-www-form-urlencoded",
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             });
        
    //             if (response.status !== 200) {
    //                 throw new Error('Failed to submit form');
    //             }

    //             closeCOA();
    //         } catch (error) {
    //             console.error('Error submitting form:', error.message);
    //         }
            
    //     }
    // };

    return (
        <div className='fixed left-0 top-0 z-50 w-full h-full bg-black bg-opacity-85 flex justify-center items-center'>
            <div className='bg-white max-w-lg p-6 w-full sm:max-w-md rounded-lg border border-zinc-300'>
                {/* <form onSubmit={(e) => handleSubmit(e)}>
                    {listInput.map((inputName, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor={inputName}>{inputName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</label>
                            <input
                                type="text"
                                id={inputName}
                                name={inputName}
                                value={formData[inputName] || ''}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    ))}
                    <div className="flex justify-between">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                        </div>
                    </form> */}
                    <button type="button" onClick={closeProfile} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg">Close</button>
            </div>
        </div>
    );
}

export default function ProfileHeader() {
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false);
    const [token, setToken] = useState('');
    const [isOpenProfile, setIsOpenProfile] = useState(false)
    
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

    const openProfile = () => {
        setIsOpenProfile(true);
    };

    const closeProfile = () => {
        setIsOpenProfile(false);
    };

    return (
        <header className="h-16 flex items-center justify-between m-4 mb-0">
            {isOpenProfile && <ModalProfile closeProfile={closeProfile} dataProfile={data} token={token} />}
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
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={openProfile}>
                                Profile
                            </button>
                        </div>
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
