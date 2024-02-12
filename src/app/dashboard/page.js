'use client'
import { useState, useEffect } from "react"
import Image from "next/image"
import JournalItem from "./components/JournalItem"
import FilterBtn from "./components/FilterBtn"
import Link from "next/link"
// import dummyJournals from "../_data/dummyJournals"

// async function getJournals() {
//     const res = await fetch("http://localhost:4000/journals")

//     return res.json()
// }

const journals = [
    {
        "noUrut": 0,
        "dateCreated": "14/02/24",
        "type": "JV",
        "noJurnal": 18,
        "name": "Dummy journals"
    },
    {
        "noUrut": 1,
        "dateCreated": "14/02/24",
        "type": "JV",
        "noJurnal": 1,
        "name": "Penyesuaian Persediaan"
    },
    {
        "noUrut": 2,
        "dateCreated": "14/02/24",
        "type": "PV",
        "noJurnal": 2,
        "name": "Pembayaran Utang Dagang"
    },
    {
        "noUrut": 3,
        "dateCreated": "14/02/24",
        "type": "RV",
        "noJurnal": 3,
        "name": "Penerimaan Penjualan Tunai"
    },
    {
        "noUrut": 4,
        "dateCreated": "14/02/24",
        "type": "JV",
        "noJurnal": 4,
        "name": "Pembebanan Biaya Operasional"
    },
    {
        "noUrut": 5,
        "dateCreated": "14/02/24",
        "type": "PV",
        "noJurnal": 5,
        "name": "Pembayaran Gaji Karyawan"
    },
    {
        "noUrut": 6,
        "dateCreated": "14/02/24",
        "type": "RV",
        "noJurnal": 6,
        "name": "Penerimaan Pendapatan Sewa"
    },
    {
        "noUrut": 7,
        "dateCreated": "14/02/24",
        "type": "JV",
        "noJurnal": 7,
        "name": "Penyusutan Aset Tetap"
    },
    {
        "noUrut": 8,
        "dateCreated": "14/02/24",
        "type": "PV",
        "noJurnal": 8,
        "name": "Pembayaran Tagihan Listrik"
    },
    {
        "noUrut": 9,
        "dateCreated": "14/02/24",
        "type": "RV",
        "noJurnal": 9,
        "name": "Penerimaan Pembayaran Piutang"
    },
    {
        "noUrut": 10,
        "dateCreated": "14/02/24",
        "type": "JV",
        "noJurnal": 10,
        "name": "Penghapusan Piutang Tak Tertagih"
    },
    {
        "noUrut": 11,
        "dateCreated": "14/02/24",
        "type": "PV",
        "noJurnal": 132,
        "name": "Pembayaran jasa desain"
    },
    {
        "noUrut": 12,
        "dateCreated": "13/02/24",
        "type": "JV",
        "noJurnal": 189,
        "name": "Another payment"
    }
]


export default async function MainDashboard() {
    // const [dummyData, setDummyData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('/data/dummyJournals.json');
    //             const data = await response.json();
    //             setDummyData(data);
    //         } catch (error) {
    //             console.error('Error fetching dummy data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // const journals = await getJournals()

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                <div className="flex gap-1 items-center text-sm p-1 rounded border border-zinc-300">
                    <FilterBtn start={true} name="Semua Jurnal" />
                    <FilterBtn start={false} name="JV (Jurnal Umum)" />
                    <FilterBtn start={false} name="RV (Jurnal Masuk)" />
                    <FilterBtn start={false} name="PV (Jurnal Keluar)" />

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
                {journals ? (
                    journals.map((item) => (
                        <JournalItem key={item.noUrut} noUrut={item.noUrut} created={item.dateCreated} type={item.type} noJurnal={item.noJurnal} name={item.name} />
                    ))
                ) : (
                    <div className="w-full h-full grid place-items-center">
                        <img src="/images/loading-placeholder.png" alt="loading" width={120} />
                    </div>
                )}


            </div>
        </main>
    )
}