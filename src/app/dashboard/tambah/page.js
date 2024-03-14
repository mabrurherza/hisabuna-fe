'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios';
import useSWR from 'swr';
import * as XLSX from 'xlsx';

function ModalCOA({ closeCOA, dataCOA, selectData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(dataCOA.data);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        filterData(event.target.value);
    };

    const filterData = (searchTerm) => {
        const filteredData = dataCOA.data.filter(coa => {
            return coa.akun_nama.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setData(filteredData);
    };

    const handleItemClick = (coa) => {
        selectData(coa);
    };

    return (
        <div className='fixed left-0 top-0 z-50 w-screen h-screen bg-black bg-opacity-85 flex justify-center p-10' >
            <div className='bg-white max-w-lg w-full rounded-lg border border-zinc-300'>
                    <button onClick={closeCOA} className='stylizedBtn'>Close</button>
                <div className='p-4 border-b border-zinc-300'>
                    <h2 className='mb-2'>Pilih Akun</h2>
                    <input 
                        type='text' 
                        className='p-2 border border-zinc-300 text-sm text-zinc-500 rounded w-full' 
                        placeholder="Cari akun" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                </div>

                <ul className='overflow-y-auto max-h-full'>
                    {data.sort((a, b) => a.akun_no.localeCompare(b.akun_no)).map(coa => (
                        <li key={coa.id} className='px-4 py-2 border-b border-zinc-300 flex gap-4' onClick={() => handleItemClick(coa)}>
                            <p>{coa.akun_no}</p>
                            <p>{coa.akun_nama}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default function TambahJurnal(prop) {
    const [isOpenCOA, setIsOpenCOA] = useState(false)
    const [jurnal, setJurnal] = useState(prop.searchParams);
    const [tableData, setTableData] = useState([]);
    const [dataCOA, setDataCOA] = useState([]);
    const [token, setToken] = useState("");

    const [selectedJurnal, setSelectedJurnal] = useState('');
    const [sendID, setSendID] = useState('');
    const [jurnalData, setJurnalData] = useState([]);
    const [namaJurnal, setNamaJurnal] = useState('');
    const [lampiran, setLampiran] = useState('');
    const [noTrans, setNoTrans] = useState('');
    const [tanggalTrans, setTanggalTrans] = useState('');
    const [increment, setIncrement] = useState(1);

    const tambahkanJurnal = () => {
        const numberOfDetails = tableData.length;
        if (namaJurnal.trim() !== '') {
            const newJurnal = {
                id: increment,
                nama: namaJurnal,
                lampiran: lampiran,
                noTrans: noTrans,
                tanggalTrans: tanggalTrans,
                details: []
            };
    
            for (let i = 0; i <= numberOfDetails-1; i++) {
                const noAkuns = document.getElementById(`noAkunDetail${i}`).value
                const namaAkuns = document.getElementById(`namaAkunDetail${i}`).value
                const debit = document.getElementById(`debitDetail${i}`).value
                const kredit = document.getElementById(`kreditDetail${i}`).value
                const detail = {
                    noAkun: noAkuns,
                    namaAkun: namaAkuns,
                    debit: debit,
                    kredit: kredit
                };
                newJurnal.details.push(detail);
                setTableData([]);
            }

            setJurnalData(prevState => [...prevState, newJurnal]);

            setNamaJurnal('');
            setLampiran('');
            setNoTrans('');
            setTanggalTrans('');

            setIncrement(prevIncrement => prevIncrement + 1);
        } else {
            alert('Nama jurnal dan lampiran tidak boleh kosong.');
        }
    };
    

    const handleJurnalChange = (e) => {
        setNamaJurnal('');
        setLampiran('');
        setNoTrans('');
        setTanggalTrans('');
        setTableData([]);
        setSelectedJurnal(e.target.value);
        const selectedJurnalName = e.target.value;
        const selectedJurnalData = jurnalData.find(jurnal => jurnal.nama.toLowerCase().replace(/\s+/g, '_') === selectedJurnalName.toLowerCase().replace(/\s+/g, '_'));
        if (selectedJurnalData) {
            setNamaJurnal(selectedJurnalData.nama);
            setLampiran(selectedJurnalData.lampiran);
            setNoTrans(selectedJurnalData.noTrans);
            setTanggalTrans(selectedJurnalData.tanggalTrans);
            tambahDetail(selectedJurnalData);
            setSelectedJurnal(selectedJurnalName);
        }
    };

    const hapusJurnal = (id) => {
        setJurnalData(prevState => prevState.filter(jurnal => jurnal.id !== id));
        setSelectedJurnal('');
        setNamaJurnal('');
        setLampiran('');
        setNoTrans('');
        setTanggalTrans('');
        setTableData([]);
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken') || "";
        setToken(authToken);
    }, []);

    const selectAkun = (coa) => {
        handleButtonAkunDetail(coa);
    };

    const handleButtonAkunDetail = (e) => {
        const id = sendID;
        const index = id.replace('buttonAkunDetail', '');
        document.getElementById(`noAkunDetail${index}`).value = e.akun_no;
        document.getElementById(`namaAkunDetail${index}`).value = e.akun_nama;
        closeCOA();
    }

    const fetcher = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_URLPROD + '/api/coa', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const { data, error } = useSWR('coas', fetcher);

    useEffect(() => {
        if (data) {
            setDataCOA(data);
        }
    }, [data]);

    const hapusDetail = (index) => {
        setTableData(prevData => {
            const newData = prevData.filter((row, i) => i !== index);
            return newData;
        });
    };

    const tambahDetail = (data) => {
        const nextKey = tableData.length;
        if(data.details && data.details.length > 0) {
            for (let z = 0; z < data.details.length; z++) {
                const newRow = (
                    <tr key={`row${z}`}>
                        <td>
                            <button id={`buttonAkunDetail${z}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                        </td>
                        <td>
                            <input name={`noAkunDetail${z}`} value={data.details[z].noAkun} id={`noAkunDetail${z}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`namaAkunDetail${z}`} value={data.details[z].namaAkun} id={`namaAkunDetail${z}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`debitDetail${z}`} value={data.details[z].debit} id={`debitDetail${z}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`kreditDetail${z}`} value={data.details[z].kredit} id={`kreditDetail${z}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <button id={`buttonHapusDetail${z}`} onClick={() => hapusDetail(z)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                        </td>
                    </tr>
                );
                setTableData(prevData => [...prevData, newRow]);
            }
        }else{
            if (data && data.length > 0 && typeof data[0].debit !== 'undefined') {
                for (let x = 0; x < data.length; x++) {
                    const newRow = (
                        <tr key={`row${x}`}>
                            <td>
                                <button id={`buttonAkunDetail${x}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                            </td>
                            <td>
                                <input name={`noAkunDetail${x}`} value={data[x].noAkun} id={`noAkunDetail${x}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`namaAkunDetail${x}`} value={data[x].namaAkun} id={`namaAkunDetail${x}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`debitDetail${x}`} value={data[x].debit} id={`debitDetail${x}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`kreditDetail${x}`} value={data[x].kredit} id={`kreditDetail${x}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <button id={`buttonHapusDetail${x}`} onClick={() => hapusDetail(x)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                            </td>
                        </tr>
                    );
                    setTableData(prevData => [...prevData, newRow]);
                }
            } else {
                const newRow = (
                    <tr key={`row${nextKey}`}>
                        <td>
                            <button id={`buttonAkunDetail${nextKey}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                        </td>
                        <td>
                            <input name={`noAkunDetail${nextKey}`} id={`noAkunDetail${nextKey}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`namaAkunDetail${nextKey}`} id={`namaAkunDetail${nextKey}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`debitDetail${nextKey}`} id={`debitDetail${nextKey}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`kreditDetail${nextKey}`} id={`kreditDetail${nextKey}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <button id={`buttonHapusDetail${nextKey}`} onClick={() => hapusDetail(nextKey)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                        </td>
                    </tr>
                );
                setTableData(prevData => [...prevData, newRow]);
            }
        }
    };

    // const handleTransaksiChange = (e) => {
    //     setSelectedTransaksi(e.target.value);
    // };

    const openCOA = (e) => {
        setSendID(e.target.id);
        setIsOpenCOA(true);
    };

    const closeCOA = () => {
        setIsOpenCOA(false);
    };

    const handleFile = (e) => {
        const fileTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
    
        const selectedFile = e.target.files[0];
        
        if (!selectedFile) {
            console.log('Please select your file!');
            return;
        }
    
        console.log(selectedFile);
    
        if (!fileTypes.includes(selectedFile.type)) {
            console.log('Selected file is not a valid Excel file.');
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            tambahDetail(jsonData);
        };
    
        reader.readAsArrayBuffer(selectedFile);
    };

    const noUrut = Number(jurnal['Semua']) + 1;

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = {
            jurnal_akun: [],
            debit: [],
            credit: [],
        };
        if (jurnalData.length > 0) {
            for (let i = 0; i < jurnalData.length; i++) {
                formData.voucher = jurnalData[i].noTrans;
                formData.keterangan = jurnalData[i].nama;
                for (let x = 0; x < jurnalData[i].details.length; x++) {
                    formData.jurnal_akun.push(jurnalData[i].details[x].noAkun);
                    formData.debit.push(jurnalData[i].details[x].debit);
                    formData.credit.push(jurnalData[i].details[x].kredit);
                }
            }
        }

        try {
            const response = await axios.post('http://localhost:8000/api/jurnal/add', formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response)

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    }

    return (
        <main id="journalContainer" className="flex flex-col flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-auto">
            {isOpenCOA && <ModalCOA closeCOA={closeCOA} dataCOA={dataCOA} selectData={selectAkun} />}

            <div className="px-4 py-4 flex text-sm gap-">
                <Link href="/dashboard">
                    <p className='hover:underline'>Dashboard Jurnal</p>
                </Link>
                <svg height="20" viewBox="0 -960 960 960" width="20" fill='gray'><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>

                <p className="font-medium text-emerald-600">Tambah Jurnal</p>
            </div>

            <section className='p-4'>
                <form onSubmit={handleSubmit}>
                <div className='flex gap-10'>
                    <div>
                        <p className='text-sm text-zinc-400 mb-2'>No. Urut</p>
                        <label htmlFor="noUrut">
                            <input id='noUrut' type="text" disabled className="border border-zinc-300 p-2 rounded w-16 text-center" value={noUrut} />
                        </label>
                    </div>

                    <div>
                        <p className='text-sm text-zinc-400 mb-2'>No. Transaksi</p>
                        <div className="relative border border-zinc-300 rounded w-32 text-center flex items-center gap-2 overflow-hidden">
                            <select
                                value={noTrans}
                                onChange={(e) => setNoTrans(e.target.value)}
                                className='border-r border-zinc-300 p-2 bg-yellow-200 font-medium outline-none appearance-none'>
                                {Object.entries(jurnal).map(([transaksi, jumlah]) => (
                                    <option key={transaksi} value={transaksi}>{transaksi} ({jumlah})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <p className='text-sm text-zinc-400 mb-2'>Tanggal Transaksi</p>
                        <input type="datetime-local" value={tanggalTrans} onChange={(e) => setTanggalTrans(e.target.value)} className="border border-zinc-300 p-2 rounded w-60" />
                    </div>
                </div>

                <div className='flex gap-10'>
                    <div>
                        <select value={selectedJurnal} onChange={handleJurnalChange} id="jurnal" className='class="bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'>
                            <option value="">Pilih Jurnal</option>
                            {jurnalData.map(jurnal => (
                                <option key={jurnal.id} value={jurnal.nama.toLowerCase().replace(/\s+/g, '_')}>{jurnal.nama}</option>
                            ))}
                        </select>
                        <p className='text-sm text-zinc-400 mb-2'>Nama Jurnal</p>
                        <input 
                            type="text" 
                            className="border border-zinc-300 p-2 rounded w-96" 
                            value={namaJurnal}
                            onChange={(e) => setNamaJurnal(e.target.value)}
                        />
                        <button 
                            className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row"
                            onClick={tambahkanJurnal}
                        >
                            Tambah
                        </button>
                        {setSelectedJurnal && (
                            <button 
                                onClick={() => hapusJurnal(jurnalData.find(jurnal => jurnal.nama.toLowerCase().replace(/\s+/g, '_') === selectedJurnal.toLowerCase().replace(/\s+/g, '_')).id)}
                                className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <div>
                        <p className='text-sm text-zinc-400 mb-2'>Lampiran</p>
                        <input 
                            type="text" 
                            className="border border-zinc-300 p-2 rounded w-96" 
                            value={lampiran}
                            onChange={(e) => setLampiran(e.target.value)}
                        />
                        {/* <button 
                            className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row"
                            onClick={tambahkanJurnal}
                        >
                            Tambah
                        </button> */}
                    </div>
                </div>
                <div className='flex justify-between items-center mt-10'>
                    <button id="saveButton" className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Submit</button>
                </div>
                <div className='flex justify-between items-center mt-10'>
                    <h4 className='text-sm text-zinc-400 mb-2'>Transaksi Jurnal</h4>
                    <input type='file' id="importExcel" onChange={handleFile} className='form-control' />
                </div>
                {/* Detail Jurnal */}
                <div>
                    <div className='flex justify-between'>
                    <button id="tambahDetail" onClick={tambahDetail} className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Tambah</button>
                    </div>
                    <table className='w-full table'>
                        <thead>
                            <tr>
                                <th className='p-2 border-b border-zinc-300'>Pilih Akun</th>
                                <th className='p-2 border-b border-zinc-300'>No Akun</th>
                                <th className='p-2 border-b border-zinc-300'>Nama Akun</th>
                                <th className='p-2 border-b border-zinc-300'>Debit</th>
                                <th className='p-2 border-b border-zinc-300'>Kredit</th>
                                <th className='p-2 border-b border-zinc-300'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='table-body' style={{overflowY: 'auto'}}>
                        {tableData.map((row, index) => (
                            <React.Fragment key={index}>
                                {row}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                </form>
            </section>
        </main>
    )
}
