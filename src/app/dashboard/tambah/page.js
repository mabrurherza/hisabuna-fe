import React from 'react'
import Link from 'next/link'

export default function TambahJurnal() {
    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="px-4 pt-4 flex">
                <Link href="/dashboard">
                    <p className='hover:underline'>Dashboard Jurnal</p>
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
                <p className="font-medium text-emerald-600">Tambah Jurnal</p>
            </div>
        </main>
    )
}
