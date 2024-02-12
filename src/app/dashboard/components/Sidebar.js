'use client'
import { useRouter } from 'next/navigation'

import Link from 'next/link'

import Image from "next/image"
import MenuItem from "./MenuItem"

function MenuButton() {
    const klik = function () {
        alert("kebuka")
    }
    return (
        <div className="flex items-center justify-center gap-1 size-12 cursor-pointer" onClick={klik}>
            <div className="bg-zinc-600 size-2 rounded-lg"></div>
            <div className="bg-zinc-600 size-2 rounded-lg"></div>
            <div className="bg-zinc-600 size-2 rounded-lg"></div>
        </div>
    )
}

export default function Sidebar() {
    const router = useRouter();

    return (
        <div id="sidebar" className="w-[320px] border-r border-r-zinc-200 h-screen">
            <div className="flex justify-between items-center px-4 py-2 border-b border-b-zinc-200">
                <Link href={"/"}>
                    <Image
                        src={"/images/brand/logo-hisabuna-color.svg"}
                        alt='Hisabuna logo'
                        height={32}
                        width={120}></Image>
                </Link>
                <MenuButton />
            </div>


            <div className="px-4 py-5 border-b border-b-zinc-200">
                <MenuItem menuName="Dashboard Jurnal" icon="ic-home" link="/dashboard" />
            </div>

            <div className="px-4 py-8 flex flex-col border-b border-b-zinc-200">
                <p className="text-sm font-medium text-zinc-400 tracking-widest">KONFIGURASI</p>
                <MenuItem icon="ic-coa-config" menuName="Chart of Account" link="/dashboard/coa" />
                <MenuItem icon="ic-saldo-awal" menuName="Saldo Awal" link="/dashboard" />
            </div>

            <div className="px-4 py-8 flex flex-col">
                <p className="text-sm font-medium text-zinc-400 tracking-widest">LAPORAN</p>
                <MenuItem icon="ic-laporan" menuName="Laba Rugi" />
                <MenuItem icon="ic-laporan" menuName="Perubahan Ekuitas/Modal" />
                <MenuItem icon="ic-laporan" menuName="Laporan Arus Kas" />
                <MenuItem icon="ic-laporan" menuName="Neraca Saldo" />
                <MenuItem icon="ic-laporan" menuName="Buku Besar" />
            </div>

        </div>)
}
