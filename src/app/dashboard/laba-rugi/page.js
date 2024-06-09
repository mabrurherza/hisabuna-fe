'use client'

import React, { useState, useEffect } from "react";
import { useFetchData } from "./../../../services/fetcher";

export default function MainDashboard() {
    const [token, setToken] = useState("");
    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const postData = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_URLPROD + '/api/report/laba-rugi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tgl_awal: startDate,
                    tgl_akhir: endDate
                })
            });

            if (!response.ok) {
                throw new Error('Gagal mengirim data ke server');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Laba_Rugi_${startDate}_${endDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setStartDate("");
            setEndDate("");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Gagal melakukan POST request: " + error.message);
        }
    };

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="px-4 pt-4">
                <p className="font-medium text-emerald-600 text-lg">Laporan Laba Rugi</p>
                <p className="font-small text-black-600 text-md">Periode Awal :</p>
                <input 
                    type="date" 
                    className="border border-gray-300 px-2 py-1 rounded-md" 
                    placeholder="Masukkan periode"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <p className="font-small text-black-600 text-md">Periode Akhir :</p>
                <input 
                    type="date" 
                    className="border border-gray-300 px-2 py-1 rounded-md" 
                    placeholder="Masukkan periode"
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <br />
                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-1 px-4 rounded mt-2" onClick={postData}>Kirim</button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </main>
    );
}
