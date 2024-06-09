'use client'

import { useState, useEffect, useMemo } from "react"
import ItemCOA from "../components/ItemCOA"
import FilterBtn from "../components/FilterBtn"
import useSWR from "swr"
import LoadingDots from "../components/LoadingDots"
import IconSearch from "@/app/components/icons/IconSearch"
import ErrorAlert from "../components/ErrorStatus"
import axios from "axios"
import { useFetchData } from "./../../../services/fetcher"
import Link from "next/link"

function ModalCOA({ closeCOA, dataCOA, token }) {
    const listInput = ['no_akun', 'nama_akun', 'saldo_awal_debit', 'saldo_awal_credit', 'arus_kas', 'anggaran'];
    const [formData, setFormData] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const noAkun = formData.no_akun;
        const found = dataCOA.some(coa => coa.akun_no === noAkun);
        if (found) {
            alert("Data sudah ada dalam dataCOA");
        } else {
            const addForm = {
                akun_no: formData.no_akun,
                akun_nama: formData.nama_akun,
                saldo_awal_debit: formData.saldo_awal_debit,
                saldo_awal_credit: formData.saldo_awal_credit,
                arus_kas: formData.arus_kas,
                anggaran: formData.anggaran
            }
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + '/api/coa/add', addForm, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status !== 200) {
                    throw new Error('Failed to submit form');
                }

                closeCOA();
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
                        <button type="button" onClick={closeCOA} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MainDashboard() {
    const [hasFetched, setHasFetched] = useState(false);
    const [dataCOA, setDataCOA] = useState([]);
    const [selectedAkun, setSelectedAkun] = useState('semua');
    const [selectedLevel, setSelectedLevel] = useState('semua');
    const [originalDataCOA, setOriginalDataCOA] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpenCOA, setIsOpenCOA] = useState(false)
    
    const [token, setToken] = useState("");
    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const { data, error, isLoading } = useFetchData(token, 'coa');

    useEffect(() => {
        if (data && !hasFetched) {
            setOriginalDataCOA(data.data);
            setDataCOA(data.data);
            setHasFetched(true);
        }
    }, [data, hasFetched]);

    const handleAkun = (jenisAkun) => {
        setSelectedAkun(jenisAkun);
        switch (jenisAkun) {
            case 'neraca':
                filterDataCOA(['1', '2', '3']);
                break;
            case 'laba-rugi':
                filterDataCOA(['4', '5']);
                break;
            default:
                setDataCOA(originalDataCOA);
                break;
        }
    };

    const handleAkunLevel = (level) => {
        setSelectedLevel(level);
        switch (level) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                filterDataCOA([level]);
                break;
            case 'semua':
                setDataCOA(originalDataCOA);
                break;
            default:
                setDataCOA(originalDataCOA);
                break;
        }
    };

    const filterDataCOA = (levels) => {
        const filteredData = originalDataCOA.filter(item => levels.includes(item.akun_no.charAt(0)));
        setDataCOA(filteredData);
    };

    const cariAkun = (searchTerm) => {
        setSearchTerm(searchTerm);
        const filteredData = originalDataCOA.filter(item => item.akun_nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.akun_no.includes(searchTerm));
        setDataCOA(filteredData);
    };

    const openCOA = () => {
        setIsOpenCOA(true);
    };

    const closeCOA = () => {
        setIsOpenCOA(false);
    };

    const importCOA = () => {
        console.log('import');
    };

    const exportCOA = () => {
        console.log('export');
    }

    const selectAkun = (coa) => {
        setDataCOA(dataCOA.filter(x => x.id != coa))
    };

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            {isOpenCOA && <ModalCOA closeCOA={closeCOA} dataCOA={dataCOA} token={token} />}
            <div className="px-4 pt-4">
                <p className="font-medium text-emerald-600 text-lg">Chart of Accounts</p>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                <div className="flex flex-wrap gap-3">
                    <div className="flex gap-1 items-center text-sm border border-zinc-300 p-0.5 rounded">
                        <FilterBtn
                            start={selectedAkun === 'semua'}
                            name="Semua"
                            onClick={() => handleAkun('semua')}
                            selected={selectedAkun === 'semua'}
                        />
                        <FilterBtn
                            start={selectedAkun === 'neraca'}
                            name="Neraca"
                            onClick={() => handleAkun('neraca')}
                            selected={selectedAkun === 'neraca'}
                        />
                        <FilterBtn
                            start={selectedAkun === 'laba-rugi'}
                            name="Laba/Rugi"
                            onClick={() => handleAkun('laba-rugi')}
                            selected={selectedAkun === 'laba-rugi'}
                        />
                    </div>
                    <div className="flex gap-1 items-center text-sm border border-zinc-300 p-0.5 rounded">
                        <p>Level:</p>
                        <FilterBtn start={selectedLevel === 'semua'} name="semua" onClick={() => handleAkunLevel('semua')} selected={selectedLevel === ''} />
                        <FilterBtn start={selectedLevel === '1'} name="1" onClick={() => handleAkunLevel('1')} selected={selectedLevel === '1'} />
                        <FilterBtn start={selectedLevel === '2'} name="2" onClick={() => handleAkunLevel('2')} selected={selectedLevel === '2'} />
                        <FilterBtn start={selectedLevel === '3'} name="3" onClick={() => handleAkunLevel('3')} selected={selectedLevel === '3'} />
                        <FilterBtn start={selectedLevel === '4'} name="4" onClick={() => handleAkunLevel('4')} selected={selectedLevel === '4'} />
                        <FilterBtn start={selectedLevel === '5'} name="5" onClick={() => handleAkunLevel('5')} selected={selectedLevel === '5'} />
                    </div>
                    <div id="SearchBar" className="relative text-sm rounded border border-zinc-300 flex items-center w-full md:w-[280px]">
                        <input className="h-full w-full p-2 rounded" type="text" placeholder="Cari akun" onChange={(e) => cariAkun(e.target.value)} />
                        <IconSearch />
                    </div>
                    <button onClick={openCOA} className="text-base tracking-normal px-4 py-2 border border-emerald-500 hover:bg-emerald-100 rounded-lg flex gap-2 flex-row">
                        <div className="plusicon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="rgb(16 185 129)">
                                <path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0 28.5 11.5T440-640v120H320q-17 0 28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                        </div>
                        Tambah Akun
                    </button>
                    <button onClick={importCOA} className="text-base tracking-normal px-4 py-1 border border-emerald-500 hover:bg-emerald-100 rounded-sm flex gap-1 flex-row">
                        <div className="plusicon">
                        </div>
                        Import Coa
                    </button>
                    <button onClick={importCOA} className="text-base tracking-normal px-4 py-1 border border-emerald-500 hover:bg-emerald-100 rounded-sm flex gap-1 flex-row">
                        <div className="plusicon">
                        </div>
                        Export Coa
                    </button>
                    <p className="text-base">* Jika ingin Import COA, ambil template dari export COA</p>
                </div>
            </div>
    
            <div className="px-4 py-2 flex gap-3 border-b border-zinc-200 text-sm bg-zinc-100">
                <div className="flex w-1/3 justify-between items-center">
                    <div className="flex-1">
                        <p>No. akun</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Golongan</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Saldo Normal</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Level</p>
                    </div>
                </div>
                <div className="flex-1 pl-5 flex items-center">
                    <p>Nama Akun</p>
                </div>
                <div className="flex-1 pl-5 flex items-center justify-center">
                    <p>Action</p>
                </div>
    
                {/* <div className="flex gap-2 items-center p-2 cursor-pointer rounded hover:bg-white">
                    <div className="flex flex-col gap-0.5 items-center">
                        <div className="h-0.5 w-5 bg-emerald-600"></div>
                        <div className="h-0.5 w-3 bg-emerald-600"></div>
                        <div className="h-0.5 w-1 bg-emerald-600"></div>
                    </div>
                    <p className="text-sm font-medium text-emerald-600">Filter</p>
                </div> */}
            </div>
    
            <div className="h-full flex-col flex overflow-y-auto bg-white pb-20">
                {error ? (
                    <ErrorAlert />
                ) : isLoading ? (
                    <LoadingDots />
                ) : (
                    dataCOA.map((i) => (
                        <ItemCOA dataCOA={i} token={token} key={i.id} idCoa={i.id} namaAkun={i.akun_nama} noAkun={i.akun_no} selectData={selectAkun} />
                    ))
                )}
            </div>
        </main>
    );    
}
