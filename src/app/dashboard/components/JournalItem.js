'use client'

import BtnSecondary from "../../components/BtnSecondary"

export default function JournalItem({ index, noUrut = 123, created = "2024-02-14 06:25:25", type = "jv", noJurnal = 345, name = "Nama jurnal/entri/pembukuan" }) {
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

    function convertDateFormat(inputDate) {
        // Create a Date object from the input string
        const dateObj = new Date(inputDate);

        // Extract day, month, and year components
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
        const year = dateObj.getFullYear();

        // Construct the desired date format
        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }

    const dateCreated = convertDateFormat(created)


    return (
        <div className="h-fit border-b border-b-zinc-300 px-4 py-3 flex items-center">
            <div className="flex w-full">
                <div className="flex w-1/4 justify-between items-center">
                    <div className="flex-1">
                        <p>{index}</p>
                    </div>
                    <div className="flex-1">
                        <p>{dateCreated}</p>
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
