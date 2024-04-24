'use client'

import { useState, useEffect, useMemo } from "react"
import ItemUser from "../components/ItemUser"
import FilterBtn from "../components/FilterBtn"
import useSWR from "swr"
import LoadingDots from "../components/LoadingDots"
import IconSearch from "@/app/components/icons/IconSearch"
import ErrorAlert from "../components/ErrorStatus"
import axios from "axios"
import { useFetchData } from "./../../../services/fetcher"
import Link from "next/link"

function ModalUSER({ closeUSER, dataUser, token, dataCompany }) {
    const listInput = ['company', 'nama', 'email', 'password'];
    const [formData, setFormData] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = formData.email;
        const found = dataUser.some(user => user.email === email);
        if (found) {
            alert("Data sudah ada dalam data User");
        } else {
            const addForm = {
                company: formData.company,
                name: formData.nama,
                email: formData.email,
                password: formData.password,
            }
            console.log(addForm)
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + '/api/users', addForm, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status !== 200) {
                    throw new Error('Failed to submit form');
                }

                closeUSER();
            } catch (error) {
                console.error('Error submitting form:', error.message);
            }
            
        }
    };

    return (
        <div className='fixed left-0 top-0 z-50 w-full h-full bg-black bg-opacity-85 flex justify-center items-center'>
            <div className='bg-white max-w-lg p-6 w-full sm:max-w-md rounded-lg border border-zinc-300'>
            <form onSubmit={(e) => handleSubmit(e)}>
                {listInput.map((inputName, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor={inputName}>
                            {inputName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                        </label>
                        {inputName === 'company' ? (
                            <select
                                id={inputName}
                                name={inputName}
                                value={formData[inputName] || ''}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Company</option>
                                {dataCompany.map((company) => (
                                    <option key={company.id} value={company.id}>{company.company_name}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                id={inputName}
                                name={inputName}
                                value={formData[inputName] || ''}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        )}
                    </div>
                ))}
                <div className="flex justify-between">
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                    <button type="button" onClick={closeUSER} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default function MainDashboard() {
    const [hasFetched, setHasFetched] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const [dataCompany, setDataCompany] = useState([]);
    const [originalDataUser, setOriginalDataUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpenUser, setIsOpenUser] = useState(false)
    
    const [token, setToken] = useState("");
    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const { data, error, isLoading } = useFetchData(token, 'users');
    const { data: datacompany, error: comperr, isLoading: loadComp } = useFetchData(token, 'company');

    // console.log(data)

    useEffect(() => {
        if (data && datacompany && !hasFetched) {
            setOriginalDataUser(data);
            setDataUser(data);
            setDataCompany(datacompany.data)
            setHasFetched(true);
        }
    }, [data, datacompany, hasFetched]);

    console.log(dataUser)

    const cariAkun = (searchTerm) => {
        setSearchTerm(searchTerm);
        const filteredData = originalDataUser.filter(item => item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.includes(searchTerm));
        setDataUser(filteredData);
    };

    const openModalUser = () => {
        setIsOpenUser(true);
    };

    const closeUSER = () => {
        setIsOpenUser(false);
    };

    const selectAkun = (user) => {
        setDataUser(dataUser.filter(x => x.id != user))
    };

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            {isOpenUser && <ModalUSER closeUSER={closeUSER} dataUser={dataUser} dataCompany={dataCompany} token={token} />}
            <div className="px-4 pt-4">
                <p className="font-medium text-emerald-600 text-lg">Data User</p>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                <div className="flex gap-3">
                    <div id="SearchBar" className="relative text-sm rounded border border-zinc-300 flex items-center w-[280px]">
                        <input className="h-full w-full p-2 rounded" type="text" placeholder="Cari User berdasarkan Email" onChange={(e) => cariAkun(e.target.value)} />
                        <IconSearch />
                    </div>
                    <button onClick={openModalUser} className="text-base tracking-normal px-4 py-2 border border-emerald-500 hover:bg-emerald-100 rounded-lg flex gap-2 flex-row">
                        <div className="plusicon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="rgb(16 185 129)">
                                <path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                        </div>
                        Tambah User
                    </button>
                </div>
            </div>
    
            <div className="px-4 py-2 flex gap-3 border-b border-zinc-200 text-sm bg-zinc-100">
                <div className="flex w-2/3 justify-between items-center">
                    <div className="flex-1">
                        <p>Nama</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Company</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Email</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Foto Profil</p>
                    </div>
                </div>
                <div className="flex-1 pl-5 flex items-center justify-center">
                    <p>Action</p>
                </div>
            </div>
    
            <div className="h-full flex-col flex overflow-y-auto bg-white pb-20">
                {error ? (
                    <ErrorAlert />
                ) : isLoading ? (
                    <LoadingDots />
                ) : (
                    dataUser.map((i) => (
                        <ItemUser
                            key={i.id}
                            companyList={dataCompany}
                            dataUser={i}
                            id={i.id}
                            name={i.name}
                            company={i.company_id ? i.company_id.company_name : 'No Company'}
                            email={i.email}
                            foto_profil={i.foto_profil ? i.foto_profil : 'Tidak Ada Foto'}
                            token={token}
                        />
                    ))
                    
                )}
            </div>
        </main>
    );    
}
