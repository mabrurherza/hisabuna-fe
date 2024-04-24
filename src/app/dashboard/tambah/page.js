'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios';
import * as XLSX from 'xlsx';
import {useFetchData} from './../../../services/fetcher';

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

export default function TambahJurnal() {
    const router = useRouter()

    const [isOpenCOA, setIsOpenCOA] = useState(false)
    const [jurnal, setJurnal] = useState();
    const [tableData, setTableData] = useState([]);
    const [dataCOA, setDataCOA] = useState([]);
    // const [dataJurnal, setDataJurnal] = useState([]);
    const [token, setToken] = useState("");
    const [hasFetched, setHasFetched] = useState(false);

    const [selectedJurnal, setSelectedJurnal] = useState('');
    const [sendID, setSendID] = useState('');
    const [jurnalData, setJurnalData] = useState([]);
    const [namaJurnal, setNamaJurnal] = useState('');
    const [lampiran, setLampiran] = useState('');
    const [noTrans, setNoTrans] = useState('PV');
    const [tanggalTrans, setTanggalTrans] = useState('');
    const [increment, setIncrement] = useState(1);
    const [noUrut, setNoUrut] = useState(0);

    const [totalTransaksi, setTotalTransaksi] = useState(0)
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalKredit, setTotalKredit] = useState(0);
    const [selisih, setSelisih] = useState(0);

    const [detailData, setDetailData] = useState([]);

    useEffect(() => {
        setToken(localStorage.getItem('authToken'));
    }, []);

    const { data: datacoa, error: errorcoa, isLoading: isLoadingCoa } = useFetchData(token, 'coa');
    const { data: datajurnal, count, error: errorjurnal, isLoading: isLoadingJurnal } = useFetchData(token, 'jurnal');

    console.log(datajurnal)
    useEffect(() => {
        if (!isLoadingCoa && !isLoadingJurnal && !hasFetched) {
            setDataCOA(datacoa);
            // let counter = Number(datajurnal.total_data !== 0 ? count.semua + 1 : 0)
            let counter;
            if(datajurnal.total_data == 0){
                setJurnal(0)
                counter = 0
            }else{
                setJurnal(datajurnal)
                counter = count.semua
            }
            setNoUrut(counter);
            setHasFetched(true);
        }
    }, [datacoa, datajurnal, count, isLoadingCoa, isLoadingJurnal, hasFetched]);

    const tambahkanJurnal = () => {
        let counter = Number(noUrut + 1);
        setNoUrut(counter);
    
        const numberOfDetails = tableData.length;
    
        if (namaJurnal.trim() !== '') {
            const newJurnal = {
                id: increment,
                nama: namaJurnal,
                lampiran: lampiran,
                voucher: noTrans,
                tanggalTrans: tanggalTrans,
                totalDebit: totalDebit,
                totalKredit: totalKredit,
                totalTransaksi: totalTransaksi,
                selisih: selisih,

                details: []
            };
    
            for (let i = 0; i < numberOfDetails; i++) {
                const noAkuns = document.getElementById(`noAkunDetail${i}`).value
                const namaAkuns = document.getElementById(`namaAkunDetail${i}`).value
                const debit = document.getElementById(`debitDetail${i}`).value
                const kredit = document.getElementById(`kreditDetail${i}`).value
                const keterangan = document.getElementById(`keteranganDetail${i}`).value
                const detail = {
                    noAkun: noAkuns,
                    namaAkun: namaAkuns,
                    debit: debit,
                    kredit: kredit,
                    keterangan: keterangan,
                };
                newJurnal.details.push(detail);
            }

            setJurnalData(prevState => [...prevState, newJurnal]);
            
            setNamaJurnal('');
            setLampiran('');
            setNoTrans('PV');
            setTanggalTrans('');
            setTableData([]);
            setTotalDebit(0)
            setTotalKredit(0)
            setTotalTransaksi(0)
            setSelisih(0)
    
            setIncrement(prevIncrement => prevIncrement + 1);
        } else {
            alert('Nama jurnal dan lampiran tidak boleh kosong.');
        }
    };
    

    const handleJurnalChange = (e) => {
        setNamaJurnal('');
        setLampiran('');
        setNoTrans('PV');
        setTanggalTrans('');
        setTableData([]);
        setSelectedJurnal(e.target.value);
        setTotalDebit(0)
        setTotalKredit(0)
        setTotalTransaksi(0)
        setSelisih(0)
        const selectedJurnalName = e.target.value;
        const selectedJurnalData = jurnalData.find(jurnal => jurnal.nama.toLowerCase().replace(/\s+/g, '_') === selectedJurnalName.toLowerCase().replace(/\s+/g, '_'));
        if (selectedJurnalData) {
            setNamaJurnal(selectedJurnalData.nama);
            setLampiran(selectedJurnalData.lampiran);
            setNoTrans(selectedJurnalData.noTrans);
            setTanggalTrans(selectedJurnalData.tanggalTrans);
            setTotalDebit(selectedJurnalData.totalDebit)
            setTotalKredit(selectedJurnalData.totalKredit)
            setTotalKredit(selectedJurnalData.keterangan)
            setTotalTransaksi(selectedJurnalData.totalTransaksi - 1)
            setSelisih(selectedJurnalData.selisih)
            tambahDetail(selectedJurnalData);
            setSelectedJurnal(selectedJurnalName);
        }
    };

    const hapusJurnal = (id) => {
        setJurnalData(prevState => prevState.filter(jurnal => jurnal.id !== id));
        setSelectedJurnal('');
        setNamaJurnal('');
        setLampiran('');
        setNoTrans('PV');
        setTanggalTrans('');
        setTableData([]);
        setTotalDebit(0)
        setTotalKredit(0)
        setTotalTransaksi(0)
        setSelisih(0)
    };

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

    // const hapusDetail = (index) => {
    //     setTableData(prevData => {
    //         const newData = prevData.filter((row, i) => i !== index);
    //         return newData;
    //     });
    //     setTotalTransaksi(prevTotalTransaksi => prevTotalTransaksi - 1);
    // };

    const hapusDetail = (index) => {
        setTotalTransaksi(prevTotalTransaksi => prevTotalTransaksi - 1);
        const element = document.getElementById(`tr${index}`);
        if (element) {
            element.remove();
        } else {
            console.error(`Elemen dengan id row${index} tidak ditemukan.`);
        }
    };

    function countTransaksi(data, voucher) {
        return data.filter(item => item.voucher === voucher).length;
    }

    const tambahDetail = (data) => {
        setTotalTransaksi(prevTotalTransaksi => prevTotalTransaksi + 1);
        const nextKey = tableData.length;
        if(data.details && data.details.length > 0) {
            for (let z = 0; z < data.details.length; z++) {
                const newRow = (
                    <tr key={`row${z}`} id={`tr${z}`}>
                        <td>
                            <button type='button' id={`buttonAkunDetail${z}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                        </td>
                        <td>
                            <input name={`noAkunDetail${z}`} value={data.details[z].noAkun} id={`noAkunDetail${z}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`namaAkunDetail${z}`} value={data.details[z].namaAkun} id={`namaAkunDetail${z}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`debitDetail${z}`} onChange={handleDebit} value={data.details[z].debit} id={`debitDetail${z}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`kreditDetail${z}`} onChange={handleKredit} value={data.details[z].kredit} id={`kreditDetail${z}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <textarea name={`keteranganDetail${z}`} id={`keteranganDetail${z}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <button type='button' id={`buttonHapusDetail${z}`} onClick={() => hapusDetail(z)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                        </td>
                    </tr>
                );
                setTableData(prevData => [...prevData, newRow]);
            }
        }else{
            if (data && data.length > 0 && typeof data[0].debit !== 'undefined') {
                console.log(detailData)
                for (let x = 0; x < data.length; x++) {
                    const newRow = (
                        <tr key={`row${x}`} id={`tr${z}`}>
                            <td>
                                <button type='button' id={`buttonAkunDetail${x}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                            </td>
                            <td>
                                <input name={`noAkunDetail${x}`} value={data[x].noAkun} id={`noAkunDetail${x}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`namaAkunDetail${x}`} value={data[x].namaAkun} id={`namaAkunDetail${x}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`debitDetail${x}`} onChange={handleDebit} value={detailData[x].debit || ''} id={`debitDetail${x}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <input name={`kreditDetail${x}`} onChange={handleKredit} value={detailData[x].kredit || ''} id={`kreditDetail${x}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <textarea name={`keteranganDetail${x}`} id={`keteranganDetail${x}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                            </td>
                            <td>
                                <button type='button' id={`buttonHapusDetail${x}`} onClick={() => hapusDetail(x)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                            </td>
                        </tr>
                    );
                    setTableData(prevData => [...prevData, newRow]);
                }
            } else {
                console.log('3')
                const newRow = (
                    <tr key={`row${nextKey}`} id={`tr${nextKey}`}>
                        <td>
                            <button type='button' id={`buttonAkunDetail${nextKey}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                        </td>
                        <td>
                            <input name={`noAkunDetail${nextKey}`} id={`noAkunDetail${nextKey}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`namaAkunDetail${nextKey}`} id={`namaAkunDetail${nextKey}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`debitDetail${nextKey}`} onChange={handleDebit} id={`debitDetail${nextKey}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <input name={`kreditDetail${nextKey}`} onChange={handleKredit} id={`kreditDetail${nextKey}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <textarea name={`keteranganDetail${nextKey}`} id={`keteranganDetail${nextKey}`} type="text" className="p-1 border border-zinc-300 rounded w-full" />
                        </td>
                        <td>
                            <button type='button' id={`buttonHapusDetail${nextKey}`} onClick={() => hapusDetail(nextKey)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                        </td>
                    </tr>
                );
                setDetailData(prevDetailData => [...prevDetailData, { debit: 0, kredit: 0, key: nextKey }]);
                setTableData(prevData => [...prevData, newRow]);
            }
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (selisih !== 0) {
            alert('Ada Selisih pada Detail Transaksi Jurnal');
            return false;
        }
    
        let formData = {
            voucher: [],
            keterangan: [],
            jurnal_tgl: [],
            lampiran: [],
            detail: []
        };
    
        if (!jurnalData || jurnalData.length === 0) {
            const numberOfDetails = tableData.length;
    
            if (namaJurnal.trim() !== '') {
                const newJurnal = {
                    id: increment,
                    nama: namaJurnal,
                    lampiran: lampiran,
                    voucher: noTrans,
                    tanggalTrans: tanggalTrans,
                    totalDebit: totalDebit,
                    totalKredit: totalKredit,
                    totalTransaksi: totalTransaksi,
                    selisih: selisih,
    
                    details: []
                };
    
                for (let i = 0; i < numberOfDetails; i++) {
                    const noAkun = document.getElementById(`noAkunDetail${i}`).value;
                    const namaAkun = document.getElementById(`namaAkunDetail${i}`).value;
                    const debit = document.getElementById(`debitDetail${i}`).value;
                    const kredit = document.getElementById(`kreditDetail${i}`).value;
                    const keterangan = document.getElementById(`keteranganDetail${i}`).value;
                    const detail = {
                        namaAkun: namaAkun,
                        jurnal_akun: noAkun,
                        debit: debit,
                        kredit: kredit,
                        keterangan: keterangan
                    };
                    newJurnal.details.push(detail);
                }
    
                formData = newJurnal;
            }
        } else {
            jurnalData.forEach(jurnal => {
                formData.voucher.push(jurnal.voucher);
                formData.keterangan.push(jurnal.nama);
                formData.jurnal_tgl.push(jurnal.tanggalTrans);
                formData.lampiran.push(jurnal.lampiran);
    
                let detailJurnal = [];
                jurnal.details.forEach(detail => {
                    let detailItem = {
                        debit: detail.debit || "0",
                        jurnal_akun: detail.noAkun,
                        credit: detail.kredit || "0",
                        keterangan: detail.keterangan
                    };
                    detailJurnal.push(detailItem);
                });
                formData.detail.push(detailJurnal);
            });
        }

        console.log(formData)
    
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + '/api/jurnal/add', formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (response.status !== 200) {
                throw new Error('Failed to submit form');
            }
    
            // router.push('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
    };
    

    const handleDebit = (event) => {
        const debitValue = parseFloat(event.target.value);
        const key = event.target.id.replace('debitDetail', '');
        
        setDetailData(prevDetailData => {
            const updatedData = prevDetailData.map(detail => {
                if (detail.key == key) {
                    return { ...detail, debit: debitValue };
                }
                return detail;
            });
            return updatedData;
        });

    };
    
    const handleKredit = (event) => {
        const kreditValue = parseFloat(event.target.value);
        const key = event.target.id.replace('kreditDetail', '');

        setDetailData(prevDetailData => {
            const updatedData = prevDetailData.map(detail => {
                if (detail.key == key) {
                    return { ...detail, kredit: kreditValue };
                }
                return detail;
            });
            return updatedData;
        });
    };

    useEffect(() => {
        const newTotalDebit = detailData.reduce((total, detail) => total + detail.debit, 0);
        const newTotalKredit = detailData.reduce((total, detail) => total + detail.kredit, 0);
    
        setTotalDebit(newTotalDebit);
        setTotalKredit(newTotalKredit);
    
        const difference = newTotalDebit - newTotalKredit;
        setSelisih(difference);
    }, [detailData]);

    console.log(jurnal)

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
                            {!isLoadingJurnal && !errorjurnal && datajurnal.total_data != 0 ? (
                                <select
                                    value={noTrans}
                                    onChange={(e) => setNoTrans(e.target.value)}
                                    className='border-r border-zinc-300 p-2 bg-yellow-200 font-medium outline-none appearance-none'>
                                    <option value="RV">RV ({countTransaksi(datajurnal.data, 'RV')})</option>
                                    <option value="PV">PV ({countTransaksi(datajurnal.data, 'PV')})</option>
                                    <option value="JV">JV ({countTransaksi(datajurnal.data, 'JV')})</option>
                                </select>
                            ) : (
                                <select
                                    value={noTrans}
                                    onChange={(e) => setNoTrans(e.target.value)}
                                    className='border-r border-zinc-300 p-2 bg-yellow-200 font-medium outline-none appearance-none'
                                >
                                    <option value="RV">RV</option>
                                    <option value="PV">PV</option>
                                    <option value="JV">JV</option>
                                </select>
                            )}
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
                            type='button'
                            className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row"
                            onClick={tambahkanJurnal}
                        >
                            Tambah
                        </button>
                        {setSelectedJurnal && (
                            <button type='button'
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
                    <button type='submit' id="saveButton" className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Submit</button>
                </div>
                {/* <div className='flex justify-between items-center mt-10'>
                    <h4 className='text-sm text-zinc-400 mb-2'>Transaksi Jurnal</h4>
                    <input type='file' id="importExcel" onChange={handleFile} className='form-control' />
                </div> */}
                {/* SubDetail Jurnal */}
                <div>
                    <div className='flex justify-between items-center'>
                        <hr className='w-1/4 border border-gray-400' />
                        <span className='mx-4'>Total Transaksi: {totalTransaksi}</span>
                        <hr className='w-1/4 border border-gray-400' />
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='mx-4'>Total Debit: {totalDebit}</span>
                        <span className='mx-4'>Total Kredit: {totalKredit}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <hr className='w-1/4 border border-gray-400' />
                        <span className='mx-4'>Selisih: {selisih}</span>
                        <hr className='w-1/4 border border-gray-400' />
                    </div>
                </div>

                {/* Detail Jurnal */}
                <div>
                    <div className='flex justify-between'>
                    <button type='button' id="tambahDetail" onClick={tambahDetail} className="stylizedBtn text-base font-sm mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Tambah</button>
                    </div>
                    <table className='w-full table'>
                        <thead>
                            <tr>
                                <th className='p-2 border-b border-zinc-300'>Pilih Akun</th>
                                <th className='p-2 border-b border-zinc-300'>No Akun</th>
                                <th className='p-2 border-b border-zinc-300'>Nama Akun</th>
                                <th className='p-2 border-b border-zinc-300'>Debit</th>
                                <th className='p-2 border-b border-zinc-300'>Kredit</th>
                                <th className='p-2 border-b border-zinc-300'>Keterangan</th>
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
