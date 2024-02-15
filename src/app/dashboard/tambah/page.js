'use client'
import { useState } from 'react'
import Link from 'next/link'


const initialState = {
    noUrut: 129,
    noTransaksi: 1115,
    tipeTransaksi: "JV",
    tglTransaksi: "2024-02-15T08:30:00Z",
    namaJurnal: "",
    lampiran: "",
    transaksi: [{
        namaTransaksi: "",
        keterangan: "",
        noAkun: 300,
        debit: {
            type: "berkurang",
            value: 1000
        },
        kredit: {
            type: "bertambah",
            value: 0,
        }
    }],

}

function ModalCOA({ closeCOA }) {

    return (
        <div className='fixed left-0 top-0 z-50 w-screen h-screen bg-black bg-opacity-85 flex justify-center p-10' onClick={closeCOA}>
            <div className='bg-white max-w-lg w-full rounded-lg border border-zinc-300'>

                <div className='p-4 border-b border-zinc-300'>
                    <h2 className='mb-2'>Pilih Akun</h2>
                    <input type='text' className='p-2 border border-zinc-300 text-sm text-zinc-500 rounded w-full' placeholder="Cari akun" />
                </div>

                <ul className=''>
                    <li className='px-4 py-2 border-b border-zinc-300 flex gap-4'>
                        <p>JV</p>
                        <p>111</p>
                        <p>Aset bertambah</p>
                    </li>
                    <li className='px-4 py-2 border-b border-zinc-300'>Item akun</li>

                </ul>


            </div>
        </div>
    )

}

export default function TambahJurnal() {
    const [isOpenCOA, setIsOpenCOA] = useState(false)

    const openCOA = () => {
        setIsOpenCOA(true);
    };

    const closeCOA = () => {
        setIsOpenCOA(false);
    };


    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            {isOpenCOA && <ModalCOA closeCOA={closeCOA} />}

            <div className="px-4 py-4 flex text-sm gap-">
                <Link href="/dashboard">
                    <p className='hover:underline'>Dashboard Jurnal</p>
                </Link>
                <svg height="20" viewBox="0 -960 960 960" width="20" fill='gray'><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>

                <p className="font-medium text-emerald-600">Tambah Jurnal</p>
            </div>

            <section className='p-4'>
                <div className='flex gap-10'>
                    <div>
                        <p className='text-sm text-zinc-400 mb-2'>No. Urut</p>
                        <label htmlFor="noUrut">
                            <input id='noUrut' type="text" disabled className="border border-zinc-300 p-2 rounded w-16 text-center" value={"300"} />
                        </label>
                    </div>

                    <div onClick={openCOA}>
                        <p className='text-sm text-zinc-400 mb-2'>No. Transaksi</p>
                        <div className="relative border border-zinc-300 rounded w-32 text-center flex items-center gap-2 overflow-hidden">
                            <p className='border-r border-zinc-300 p-2 bg-yellow-200 font-medium'>JV</p>
                            <p className='p-2'>103</p>
                            <div ></div>
                            <svg className='rotate-90 absolute right-2' height="20" viewBox="0 -960 960 960" width="20" fill='gray'><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
                        </div>
                    </div>

                </div>

            </section>
        </main>
    )
}
