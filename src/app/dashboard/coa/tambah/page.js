'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFetchData } from './../../../../services/fetcher'

export default function CoaTable() {
    const [coaList, setCoaList] = useState([]);
    const [token, setToken] = useState("");
    const [newCoa, setNewCoa] = useState({
        akun_no: '',
        akun_nama: '',
        saldo_awal_debit: '',
        saldo_awal_credit: '',
        arus_kas: '',
        anggaran: ''
    });

    useEffect(() => {
        const value = localStorage.getItem('authToken') || "";
        setToken(value);
    }, []);

    const { data, error, isLoading } = useFetchData(token, 'coa');

    useEffect(() => {
        if(!isLoading){
            setCoaList(data.data)
        }
    },[data, isLoading])

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCoaList = [...coaList];
        updatedCoaList[index][name] = value;
        setCoaList(updatedCoaList);
    };

    const handleAddRow = () => {
        // Copy newCoa object to prevent mutation
        const newCoaCopy = { ...newCoa };
        setCoaList([...coaList, newCoaCopy]);
        // Reset newCoa state to default values
        setNewCoa({
            akun_no: '',
            akun_nama: '',
            saldo_awal_debit: '',
            saldo_awal_credit: '',
            arus_kas: '',
            anggaran: ''
        });
    };

    const handleRemoveRow = (index) => {
        const updatedCoaList = [...coaList];
        updatedCoaList.splice(index, 1);
        setCoaList(updatedCoaList);
    };

    const handleSaveRow = (index) => {
        const editedCoa = coaList[index];
        // Call API to save edited COA data
        console.log('Saving edited COA:', editedCoa);
    };

    return (
        <div className="flex-1 h-full rounded-xl p-4 overflow-hidden">
            <button onClick={handleAddRow} className="stylizedBtn text-base font-medium tracking-normal px-2 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-sm text-white flex gap-2 flex-row">Add Row</button>
            <div className="container mx-auto max-h-80">
                <table className="table-auto w-full h-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Nomor Akun</th>
                            <th className="px-4 py-2">Nama Akun</th>
                            <th className="px-4 py-2">Saldo Awal Debit</th>
                            <th className="px-4 py-2">Saldo Awal Kredit</th>
                            <th className="px-4 py-2">Arus Kas</th>
                            <th className="px-4 py-2">Anggaran</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ overflowY: 'auto', height: '100%' }}>
                        {coaList.map((coa, index) => (
                            <tr key={index}>
                                <td><input type="text" name="akun_no" value={coa.akun_no} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td><input type="text" name="akun_nama" value={coa.akun_nama} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td><input type="text" name="saldo_awal_debit" value={coa.saldo_awal_debit} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td><input type="text" name="saldo_awal_credit" value={coa.saldo_awal_credit} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td><input type="text" name="arus_kas" value={coa.arus_kas} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td><input type="text" name="anggaran" value={coa.anggaran} onChange={(e) => handleInputChange(e, index)} className="px-4 py-2 border rounded w-full" /></td>
                                <td>
                                    <button onClick={() => handleRemoveRow(index)} className="stylizedBtn text-base font-medium tracking-normal px-2 py-1 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-sm text-white flex gap-2 flex-row">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
