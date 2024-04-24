'use client'

import { useState, useEffect, useMemo } from "react"
import { ItemSaldoAwal } from "../components/ItemCOA"
import FilterBtn from "../components/FilterBtn"
import useSWR from "swr"
import LoadingDots from "../components/LoadingDots"
import IconSearch from "@/app/components/icons/IconSearch"
import ErrorAlert from "../components/ErrorStatus"
import axios from "axios"
import { useFetchData } from "../../../services/fetcher"
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
    const [totalDebit, setTotalDebit] = useState(0)
    const [totalKredit, setTotalKredit] = useState(0)
    const [totalSelisih, setTotalSelisih] = useState(0)
    
    const [token, setToken] = useState("");
    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const { data, error, isLoading } = useFetchData(token, 'coa');

    console.log(data)
    

    useEffect(() => {
        if (data && !hasFetched) {
            const filteredData = data.data.filter(item => item.akun_no.includes('-'));
            
            const totalDebit = filteredData.reduce((acc, item) => {
                return acc + (parseInt(item.total_transaksi_debit) || 0);
            }, 0);
    
            const totalCredit = filteredData.reduce((acc, item) => {
                return acc + (parseInt(item.total_transaksi_credit) || 0);
            }, 0);
    
            const totalDifference = totalDebit - totalCredit;
    
            setTotalDebit(totalDebit);
            setTotalKredit(totalCredit);
            setTotalSelisih(totalDifference);
            setDataCOA(filteredData);
            setHasFetched(true);
        }
    }, [data, hasFetched]);
    

    const selectAkun = (coa) => {
        setDataCOA(dataCOA.filter(x => x.id != coa))
    };

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            {isOpenCOA && <ModalCOA closeCOA={closeCOA} dataCOA={dataCOA} token={token} />}
            <div className="px-4 pt-4">
                <p className="font-medium text-emerald-600 text-lg">Saldo Awal</p>
            </div>

            <div className="px-4 py-2 flex gap-3 border-b border-zinc-200 text-sm bg-zinc-100 w-full">
                <div className="flex w-full justify-between items-center">
                    <div className="flex-1 text-end">
                        <p>Selisih: {totalSelisih}</p>
                    </div>
                    <div className="flex-1">
                        &nbsp;
                    </div>
                    <div className="flex-1">
                        <p>Total Debit: {totalDebit}</p>
                    </div>
                    <div className="flex-1">
                        <p>Total Kredit: {totalKredit}</p>
                    </div>
                </div>
            </div>
    
            <div className="px-4 py-2 flex gap-3 border-b border-zinc-200 text-sm bg-zinc-100 w-full">
                <div className="flex w-full justify-between items-center">
                    <div className="flex-1">
                        <p>No. akun</p>
                    </div>
                    <div className="flex-1">
                        <p>Nama Akun</p>
                    </div>
                    <div className="flex-1">
                        <p>Debit</p>
                    </div>
                    <div className="flex-1">
                        <p>Kredit</p>
                    </div>
                </div>
            </div>
    
            <div className="h-full flex-col flex overflow-y-auto bg-white pb-20">
                {error ? (
                    <ErrorAlert />
                ) : isLoading ? (
                    <LoadingDots />
                ) : (
                    dataCOA.map((i) => (
                        <ItemSaldoAwal dataCOA={dataCOA} token={token} key={i.id} idCoa={i.id} namaAkun={i.akun_nama} noAkun={i.akun_no} debit={i.saldo_awal_debit} kredit={i.saldo_awal_credit} selectData={selectAkun} />
                    ))
                )}
            </div>
        </main>
    );    
}
