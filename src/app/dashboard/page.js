'use client'


import { useState, useEffect } from "react"
import Image from "next/image"
import JournalItem from "./components/JournalItem"
import FilterBtn from "./components/FilterBtn"
import axios from "axios"
import Link from "next/link"
import useSWR from "swr"
import { useRouter } from 'next/navigation'
import LoadingDots from "./components/LoadingDots"
import IconSearch from "../components/icons/IconSearch"
import ErrorAlert from "./components/ErrorStatus"

axios.defaults.withCredentials = true;

export default function MainDashboard() {
    const router = useRouter()


    const [selectedFilters, setSelectedFilters] = useState(["Semua"]);
    const [searchQuery, setSearchQuery] = useState("");
    const [token, setToken] = useState("")

    useEffect(() => {
        let value
        value = localStorage.getItem('authToken') || ""
        setToken(value)
      }, [])

    const fetcher = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_URLPROD + '/api/jurnal', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }


    const { data, error, isLoading } = useSWR('jurnals', fetcher);
    const { data: dataArray } = data || {};

    const [dataJournals, setDataJournals] = useState([])

    useEffect(() => {
        if (dataArray) {
            setDataJournals(dataArray);
            console.log(dataArray)
        }
    }, [dataArray]);


    // if (!dataArray) {
    //     return <div>Loading...</div>;
    // }

    // if (error) return <div>Failed to load</div>;


    const handleFilterClick = (filter) => {
        if (filter === 'Semua') {
            setSelectedFilters(['Semua']);
        } else {
            setSelectedFilters((prevFilters) => {
                if (prevFilters.includes('Semua')) {
                    return [filter];
                }

                const updatedFilters = prevFilters.includes(filter)
                    ? prevFilters.filter((f) => f !== filter)
                    : [...prevFilters, filter];

                if (updatedFilters.length === 0) {
                    return ['Semua'];
                }

                return updatedFilters;
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = selectedFilters.includes('Semua')
        ? dataJournals
        : dataJournals.filter((item) => selectedFilters.includes(item.voucher));

    const searchedData = searchQuery
        ? filteredData.filter((item) =>
            item.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : filteredData;

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                <div className="flex gap-3">
                    <div className="flex gap-1 items-center text-sm p-1 rounded border border-zinc-300">
                        {['Semua', 'JV', 'RV', 'PV'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterClick(filter)}
                                className={`py-1 px-2  cursor-pointer rounded-sm ${selectedFilters.includes(filter) ? 'text-white bg-emerald-500' : 'bg-white'}`}
                            >
                                {filter}
                            </button>
                        ))}


                    </div>

                    <div id="SearchBar" className="relative text-sm rounded border border-zinc-300 flex items-center w-[400px]">
                        <input
                            className="h-full w-full p-2 rounded"
                            type="text"
                            placeholder="Cari jurnal atau entri"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <IconSearch />
                    </div>
                </div>
                <Link href="/dashboard/tambah">
                    <button className="stylizedBtn text-base font-medium tracking-normal px-4 py-2 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-2 flex-row">
                        <div className="plusicon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"><path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        </div>
                        Tambah Jurnal
                    </button>
                </Link>
            </div>

            <div className="px-4 py-2 flex border-b border-zinc-200 text-sm bg-zinc-100">
                <div className=" flex w-1/4 justify-between items-center">
                    <div className="flex-1">
                        <p>No. urut</p>
                    </div>
                    <div className="flex-1">
                        <p>Dibuat</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>Tipe</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>No. jurnal</p>
                    </div>
                </div>

                <div className="flex-1 pl-5 flex items-center">
                    <p>Nama jurnal</p>
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
                {error ? <ErrorAlert /> : isLoading ? <LoadingDots /> :
                    searchedData.map((item, index) => (
                        <JournalItem key={item.id} index={index} noUrut={`${item.voucher} - ${item.trans_no}`} created={item.jurnal_tgl} type={item.voucher} noJurnal={item.trans_no} name={item.keterangan} />
                    ))
                }
            </div>
        </main>
    )
}
