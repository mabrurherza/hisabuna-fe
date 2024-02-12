'use client'

import BtnSecondary from "../../components/BtnSecondary"

export default function ItemCOA({ noAkun = 9, golongan = "Aset", saldoNormal = "Debit", level = 123, namaAkun = "Nama jurnal/entri/pembukuan" }) {
    function journalType() {
        switch (type) {
            default:
                return "bg-yellow-200";
            case 'PV':
                return "bg-blue-200";
            case 'RV':
                return "bg-violet-200";
        }
    }


    return (
        <div className="h-fit border-b border-b-zinc-300 px-4 py-3 flex items-center">
            <div className="flex w-full">
                <div className=" flex w-1/3 justify-between items-center">
                    <div className="flex-1">
                        <p>{noAkun}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{golongan}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{saldoNormal}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{level}</p>
                    </div>
                </div>

                <div className="flex-1 pl-5 flex items-center">
                    <p>{namaAkun}</p>
                </div>

            </div>


        </div>
    )
}
