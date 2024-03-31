'use client'

import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useFetchDataById, useFetchData } from './../../../../services/fetcher';
import { useRouter } from 'next/navigation';
 

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
                  {data && (
                    data.sort((a, b) => a.akun_no.localeCompare(b.akun_no)).map(coa => (
                        <li key={coa.id} className='px-4 py-2 border-b border-zinc-300 flex gap-4' onClick={() => handleItemClick(coa)}>
                            <p>{coa.akun_no}</p>
                            <p>{coa.akun_nama}</p>
                        </li>
                    ))
                  )}
              </ul>
          </div>
      </div>
  );
}

export default function EditJurnal() {
  const params = useParams();
  const router = useRouter()
  const [token] = useState(localStorage.getItem('authToken'));
  const { data: datas, error, isLoading } = useFetchDataById(token, 'jurnal', params.id);
  const [data, setData] = useState({})

  useEffect(() => {
        if(datas){
            setData(datas)
        }
  })

  const [isOpenCOA, setIsOpenCOA] = useState(false)
  const [tableData, setTableData] = useState([]);
  const [dataCOA, setDataCOA] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [sendID, setSendID] = useState('');
  const [jurnalData, setJurnalData] = useState([]);
  const [namaJurnal, setNamaJurnal] = useState('');
  const [lampiran, setLampiran] = useState('');
  const [noTrans, setNoTrans] = useState('PV');
  const [tanggalTrans, setTanggalTrans] = useState('');
  const [noUrut, setNoUrut] = useState('');
  const [detail, setDetail] = useState([])
  const [detailNo, setDetailNo] = useState(0)
  const [newDetail, setNewDetail] = useState([]);

  useEffect(() => {
    if (Object.keys(data).length !== 0 && !isLoading && !error) {
      setNoUrut(Number(data.trans_no));
      setNamaJurnal(data.keterangan)
      setLampiran(data.lampiran)
      setNoTrans(data.voucher + '-' + Number(data.trans_no))
      setTanggalTrans(data.jurnal_tgl)
      setDetail(data.detail)
      setDetailNo(data.detail ? data.detail.length : 0)
    }
  }, [data, isLoading, error]);

  
  const { data: datacoa, error: errorcoa, isLoading: isLoadingCoa } = useFetchData(token, 'coa');


  useEffect(() => {
      if (!isLoadingCoa && !hasFetched) {
          setDataCOA(datacoa);
          setHasFetched(true);
      }
  }, [datacoa, isLoadingCoa, hasFetched]);


  const selectAkun = (coa) => {
      handleButtonAkunDetail(coa);
      
  };

  const handleButtonAkunDetail = (e) => {
        const id = sendID;
        const index = id.replace('buttonAkunDetail', '');

        const newDetailItem = {
            jurnal_akun: {
                akun_no: e.akun_no,
                akun_nama: e.akun_nama,
            },
            debit: e.debit,
            credit: e.credit,
        };

        const updatedNewDetail = {...newDetail};

        if (
            newDetailItem.jurnal_akun.akun_no !== '' &&
            newDetailItem.jurnal_akun.akun_nama !== ''
        ) {
            updatedNewDetail[index] = newDetailItem;
        }

        setNewDetail(updatedNewDetail);

        document.getElementById(`noAkunDetail${index}`).value = e.akun_no;
        document.getElementById(`namaAkunDetail${index}`).value = e.akun_nama;

        closeCOA();
    };


  console.log(detail)
  console.log(newDetail)

  const hapusDetail = (index) => {
        const element = document.getElementById(`tr${index}`);
        if (element) {
            element.remove();
        } else {
            console.error(`Elemen dengan id row${index} tidak ditemukan.`);
        }
    };

  const tambahDetail = (data) => {
    console.log(detailNo)
    setDetailNo(prevDetailNo => prevDetailNo + 1);
    const newRow = (
        <tr key={`row${detailNo}`} id={`tr${detailNo}`}>
            <td>
                <button id={`buttonAkunDetail${detailNo}`} onClick={detail ? openCOA : false} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
            </td>
            <td>
              <input name={`noAkunDetail${detailNo}`} id={`noAkunDetail${detailNo}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
            </td>
            <td>
              <input name={`namaAkunDetail${detailNo}`} id={`namaAkunDetail${detailNo}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
            </td>
            <td>
                <input
                    name={`debitDetail${detailNo}`}
                    onChange={e => setNewDetail(prevState => ({
                        ...prevState,
                        [detailNo]: {
                            ...prevState[detailNo],
                            debit: e.target.value
                        }
                    }))}
                    type="text"
                    className="p-1 border border-zinc-300 rounded w-full"
                />
            </td>
            <td>
                <input
                    name={`kreditDetail${detailNo}`}
                    onChange={e => setNewDetail(prevState => ({
                        ...prevState,
                        [detailNo]: {
                            ...prevState[detailNo],
                            credit: e.target.value
                        }
                    }))}
                    type="text"
                    className="p-1 border border-zinc-300 rounded w-full"
                />
            </td>
            <td>
                <button id={`buttonHapusDetail${detailNo}`} onClick={() => hapusDetail(detailNo)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
            </td>
        </tr>
    );

    setTableData(prevData => [...prevData, newRow]);
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

      const gabung = detail.concat(Object.values(newDetail));
      let formData = {
          voucher: noTrans,
          keterangan: namaJurnal,
          lampiran: lampiran ? lampiran : '',
          jurnal_tgl: tanggalTrans,
          
          detail: gabung
      };

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + `/api/jurnal/edit/${params.id}`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                }
            });
        
            if (response.status !== 200) {
                throw new Error('Failed to submit form');
            }else{
                if(response.data.status == false){
                    alert(response.data.message)
                }
            }
        
            console.log('Form submitted successfully');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error.message);
        }
  };


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
                      {/* <div className="relative border border-zinc-300 rounded w-32 text-center flex items-center gap-2 overflow-hidden"> */}
                      {/* {jurnal && (
                        <select
                          value={noTrans}
                          onChange={(e) => setNoTrans(e.target.value)}
                          className='border-r border-zinc-300 p-2 bg-yellow-200 font-medium outline-none appearance-none'>
                          {Object.keys(jurnal).filter(transaksi => transaksi !== 'semua').map(transaksi => (
                              <option key={transaksi} value={transaksi}>{transaksi} ({jurnal[transaksi]})</option>
                          ))}
                        </select>
                      )} */}
                      <input type="text" value={noTrans} readOnly className="border border-zinc-300 p-2 rounded w-60" />
                      {/* </div> */}
                  </div>

                  <div>
                      <p className='text-sm text-zinc-400 mb-2'>Tanggal Transaksi</p>
                      <input type="datetime-local" value={tanggalTrans} onChange={(e) => setTanggalTrans(e.target.value)} className="border border-zinc-300 p-2 rounded w-60" />
                  </div>
              </div>

              <div className='flex gap-10'>
                  <div>
                      {/* <select value={selectedJurnal} onChange={handleJurnalChange} id="jurnal" className='class="bg-gray-50 border mt-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"'>
                          <option value="">Pilih Jurnal</option>
                          {jurnalData.map(jurnal => (
                              <option key={jurnal.id} value={jurnal.nama.toLowerCase().replace(/\s+/g, '_')}>{jurnal.nama}</option>
                          ))}
                      </select> */}
                      <p className='text-sm text-zinc-400 mb-2'>Nama Jurnal</p>
                      <input 
                          type="text" 
                          className="border border-zinc-300 p-2 rounded w-96" 
                          value={namaJurnal}
                          onChange={(e) => setNamaJurnal(e.target.value)}
                      />
                      {/* <button 
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
                      )} */}
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
              <div className='flex justify-between items-center mt-10'>
                  <h4 className='text-sm text-zinc-400 mb-2'>Transaksi Jurnal</h4>
                  <input type='file' id="importExcel" onChange={handleFile} className='form-control' />
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
                              <th className='p-2 border-b border-zinc-300'>Action</th>
                          </tr>
                      </thead>
                      <tbody className='table-body' style={{ overflowY: 'auto' }}>
                        {detail && (
                            detail.map((item, index) => (
                            <tr key={`row${index}`} id={`tr${index}`}>
                                <td>
                                <button id={`buttonAkunDetail${index}`} onClick={openCOA} className="stylizedBtn text-sm font-medium mt-2 tracking-normal px-3 py-1 border border-emerald-500 bg-emerald-500 hover:bg-emerald-800 hover:border-emerald-800 rounded-lg text-white flex gap-1 flex-row">Akun</button>
                                </td>
                                <td>
                                <input name={`noAkunDetail${index}`} value={item.jurnal_akun.akun_no} id={`noAkunDetail${index}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                                </td>
                                <td>
                                <input name={`namaAkunDetail${index}`} value={item.jurnal_akun.akun_nama} id={`namaAkunDetail${index}`} readOnly type="text" className="p-1 border border-zinc-300 rounded w-full" />
                                </td>
                                <td>
                                <input 
                                    name={`debitDetail${index}`} 
                                    value={item.debit}
                                    onChange={e => {
                                        const updatedDetail = [...detail];
                                        updatedDetail[index] = {...updatedDetail[index], debit: e.target.value};
                                        setDetail(updatedDetail);
                                    }}
                                    id={`debitDetail${index}`} 
                                    type="text" 
                                    className="p-1 border border-zinc-300 rounded w-full" 
                                />
                                </td>
                                <td>
                                <input 
                                    name={`kreditDetail${index}`} 
                                    value={item.credit}
                                    onChange={e => {
                                        const updatedDetail = [...detail];
                                        updatedDetail[index] = {...updatedDetail[index], credit: e.target.value};
                                        setDetail(updatedDetail);
                                    }}
                                    id={`kreditDetail${index}`}
                                    type="text" 
                                    className="p-1 border border-zinc-300 rounded w-full" 
                                />
                                </td>
                                <td>
                                <button id={`buttonHapusDetail${index}`} onClick={() => hapusDetail(index)} className="stylizedBtn text-sm font-sm mt-1 tracking-normal px-2 border border-red-500 bg-red-500 hover:bg-red-800 hover:border-red-800 rounded-lg text-white flex gap-1 flex-row">Hapus</button>
                                </td>
                            </tr>
                            ))
                        )}
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