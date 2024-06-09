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
            const response = await fetch(process.env.NEXT_PUBLIC_URLPROD + '/api/report/buku-besar', {
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
            link.setAttribute('download', `Laporan_Buku_Besar_${startDate}_${endDate}.pdf`);
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
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
                <h1 className="text-xl font-semibold text-emerald-600 mb-4">Laporan Buku Besar</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periode Awal :</label>
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periode Akhir :</label>
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
                    />
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 ease-in-out" onClick={postData}>Kirim</button>
                {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
            </div>
        </main>
    );
}
