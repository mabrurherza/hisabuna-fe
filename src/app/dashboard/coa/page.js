'use client'


import { useState, useEffect } from "react"
import ItemCOA from "../components/ItemCOA"
import FilterBtn from "../components/FilterBtn"
import useSWR from "swr"
import LoadingDots from "../components/LoadingDots"
import IconSearch from "@/app/components/icons/IconSearch"
import ErrorAlert from "../components/ErrorStatus"
import axios from "axios"

export default function MainDashboard() {

    const token = localStorage.getItem('authToken');

    const fetcher = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_URLPROD + '/api/coa', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data)
    
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }


    const { data, error, isLoading } = useSWR('coas', fetcher);
    const { data: dataArray } = data || {};

    const [dataCOA, setDataCOA] = useState([])

    useEffect(() => {
        if (dataArray) {
            setDataCOA(dataArray);
            console.log(dataArray)
        }
    }, [dataArray]);

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="px-4 pt-4">
                <p className="font-medium text-emerald-600 text-lg">Chart of Accounts</p>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                <div className="flex gap-3">
                    <div className="flex gap-1 items-center text-sm border border-zinc-300  p-0.5 rounded">
                        <FilterBtn name="Semua Akun" />
                        <FilterBtn start={false} name="Akun Neraca" />
                        <FilterBtn start={false} name="Akun Laba/Rugi" />
                    </div>
                    <div className="flex gap-1 items-center text-sm border border-zinc-300  p-0.5 rounded">
                        <p>Level:</p>
                        <FilterBtn start={true} name="1—5" />
                        <FilterBtn start={false} name="1" />
                        <FilterBtn start={false} name="2" />
                        <FilterBtn start={false} name="3" />
                        <FilterBtn start={false} name="4" />
                        <FilterBtn start={false} name="5" />
                    </div>
                    <div id="SearchBar" className="relative text-sm rounded border border-zinc-300 flex items-center w-[280px]">
                        <input className="h-full w-full p-2 rounded" type="text" placeholder="Cari akun" />
                        <IconSearch />
                    </div>
                <button className=" text-base tracking-normal px-4 py-2 border border-emerald-500 hover:bg-emerald-100 rounded-lg flex gap-2 flex-row">
                    <div className="plusicon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="rgb(16 185 129)"><path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                    </div>
                    Tambah Akun
                </button>
                </div>
            </div>

            <div className="px-4 py-2 flex border-b border-zinc-200 text-sm bg-zinc-100">
                <div className=" flex w-1/3 justify-between items-center">
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

                <div className="flex gap-2 items-center p-2 cursor-pointer rounded hover:bg-white">
                    <div className="flex flex-col gap-0.5 items-center">
                        <div className="h-0.5 w-5 bg-emerald-600"></div>
                        <div className="h-0.5 w-3 bg-emerald-600"></div>
                        <div className="h-0.5 w-1 bg-emerald-600"></div>
                    </div>
                    <p className="text-sm font-medium text-emerald-600">Filter</p>
                </div>
            </div>

            <div className="h-full flex-col flex overflow-y-auto bg-white pb-20">
                {error ? <ErrorAlert /> : isLoading ? <LoadingDots /> : dataCOA.map((i) => <ItemCOA key={i.id} namaAkun={i.akun_nama} noAkun={i.akun_no} />)}

            </div>
        </main>
    )
}
