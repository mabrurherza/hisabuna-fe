'use client'

import BtnSecondary from "../../components/BtnSecondary"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"

export default function JournalItem({ index, id, noUrut = 123, created = "2024-02-14 06:25:25", type = "jv", noJurnal = 345, name = "Nama jurnal/entri/pembukuan", selectData }) {
    const router = useRouter()

    const [token, setToken] = useState("");
    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);



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
        const dateObj = new Date(inputDate);

        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }

    const dateCreated = convertDateFormat(created)


    function handleOnClick(id) {
        router.push(`/dashboard/edit/${id}`)
    }

    const handleDownloadJurnalById = (id) => {
        fetch(process.env.NEXT_PUBLIC_URLPROD + `/api/jurnal/report/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat mengunduh jurnal');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jurnal_${id}.pdf`);
            
            document.body.appendChild(link);
            link.click();
            
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    };

    const handleDeleteJurnal = (id) => {
        fetch(process.env.NEXT_PUBLIC_URLPROD + `/api/jurnal/delete/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat menghapus jurnal');
            }

            handleItemClick(id)
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    };

    const handleItemClick = (jurnalId) => {
        selectData(jurnalId);
    };


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
                        <BtnSecondary name="Edit" onClick={() => handleOnClick(id)} />
                        <BtnSecondary name="Print" variant="outline" onClick={() => handleDownloadJurnalById(id)} />
                        <BtnSecondary name="Hapus" onClick={() => handleDeleteJurnal(id)} variant="text" textColor="text-red-500" />
                    </div>
                </div>
            </div>
        </div>
    )
}
