'use client'

import BtnSecondary from "../../components/BtnSecondary"

export default function JournalItem({ noUrut = 123, created = "12/03/24", type = "jv", noJurnal = 345, name = "Nama jurnal/entri/pembukuan" }) {
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
                <div className="flex w-1/4 justify-between items-center">
                    <div className="flex-1">
                        <p>{noUrut}</p>
                    </div>
                    <div className="flex-1">
                        <p>{created}</p>
                    </div>
                    <div className="flex-1 grid place-items-center text-center">
                        <p className={`uppercase rounded px-2 text-sm font-bold tracking-wider  ${journalType()}`}>{type}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{noJurnal}</p>
                    </div>
                </div>

                <div className="flex-1 pl-5 flex justify-between items-center">
                    <div >
                        <p>{name}</p>
                    </div>
                    <div className="flex gap-2 w-fit">
                        <BtnSecondary name="Edit" />
                        <BtnSecondary name="Print" variant="outline" />
                        <BtnSecondary name="Hapus" variant="text" textColor="text-red-500" />

                    </div>
                </div>
            </div>


        </div>
    )
}
