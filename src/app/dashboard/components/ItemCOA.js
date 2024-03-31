'use client'

import BtnSecondary from "../../components/BtnSecondary"
import { useEffect, useState } from "react";
import axios from "axios"
import { useRouter } from 'next/navigation'

function ModalCOA({ closeCOA, dataCOA, token, id }) {
    const router = useRouter()
    const listInput = ['akun_no', 'akun_nama', 'saldo_awal_debit', 'saldo_awal_credit', 'arus_kas', 'anggaran'];
    const [formData, setFormData] = useState({});
    const data = dataCOA.filter(item => item["akun_no"] === id);
    
    useEffect(() => {
        if (data.length > 0) {
            const initialFormData = {};
            listInput.forEach(inputName => {
                initialFormData[inputName] = data[0][inputName];
            });
            setFormData(initialFormData);
        }
    }, [data, listInput]);
    const listInputMemoized = useMemo(() => listInput, [listInput]);
    
    useEffect(() => {
        console.log(formData);
    }, [formData]);
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const noAkun = formData.akun_no;
        const found = dataCOA.some(coa => coa.akun_no === noAkun);
        if (found && noAkun !== id) {
            alert("Data sudah ada dalam dataCOA");
        } else {
            const addForm = {
                akun_no: formData.akun_no,
                akun_nama: formData.akun_nama,
                saldo_awal_debit: formData.saldo_awal_debit,
                saldo_awal_credit: formData.saldo_awal_credit,
                arus_kas: formData.arus_kas,
                anggaran: formData.anggaran
            }

            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + `/api/coa/edit/${data[0].id}`, addForm, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`
                    }
                });
        
                if (response.status !== 200) {
                    throw new Error('Failed to submit form');
                }

                closeCOA();
                router.push('/dashboard/coa')
            } catch (error) {
                console.error('Error submitting form:', error.message);
            }
        }
    };

    return (
        <div className='fixed left-0 top-0 z-50 w-full h-full bg-black bg-opacity-85 flex justify-center items-center'>
            <div className='bg-white max-w-lg p-6 w-full sm:max-w-md rounded-lg border border-zinc-300'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    {listInput.map((inputName, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor={inputName}>{inputName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</label>
                            <input
                                type="text"
                                id={inputName}
                                name={inputName}
                                value={formData[inputName] || data[0][inputName] || ''}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    ))}
                    <div className="flex justify-between">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                        <button type="button" onClick={closeCOA} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default function ItemCOA({ dataCOA ,token ,noAkun = 9, golongan = "Aset", saldoNormal = "Debit", level = 123, namaAkun = "", idCoa, selectData }) {
    const router = useRouter()
    const [isOpenCOA, setIsOpenCOA] = useState(false)
    const [akunCOA, setAkunCOA] = useState("")

    
    function determineLevel(data) {
        const parts = data.split('-');
        const levels = parts.map(part => part.replace(/\D/g, '').length);
        let totalLength = levels.reduce((acc, cur) => acc + cur, 0);
        if(totalLength == 6){
            totalLength = 5
        }
        return totalLength
    }

    function golonganChange(data){
        if(data <= 0){
            return "Tidak Diketahui";
        } else if(data <= 3){
            switch(data){
                case 1:
                    return "Aset";
                case 2:
                    return "Liabilitas";
                case 3:
                    return "Ekuitas";
            }
        } else if(data == 4){
            return "Pendapatan";
        } else {
            return "Beban";
        }
    }

    function handleDebitCredit(data){
        const firstChar = data.charAt(0);
        if(firstChar == '3' || firstChar == '4' || firstChar == '2') {
            return "Kredit";
        } else {
            return "Debit";
        }
    }

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

    const openCOA = (akun) => {
        setAkunCOA(akun)
        setIsOpenCOA(true);
    };

    const closeCOA = () => {
        setIsOpenCOA(false);
    };

    const handleDeleteCoa = (id) => {
        fetch(process.env.NEXT_PUBLIC_URLPROD + `/api/coa/delete/${id}`, {
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

    const handleItemClick = (coa) => {
        selectData(coa);
    };


    return (
        <div className="h-fit border-b border-b-zinc-300 px-4 py-3 flex items-center">
            {isOpenCOA && <ModalCOA closeCOA={closeCOA} dataCOA={dataCOA} token={token} id={akunCOA}/>}
            <div className="flex w-full">
                <div className=" flex w-1/3 justify-between items-center">
                    <div className="flex-1">
                        <p>{noAkun}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{golonganChange(determineLevel(noAkun))}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{handleDebitCredit(noAkun)}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{determineLevel(noAkun)}</p>
                    </div>
                </div>
                <div className="flex-1 pl-5 flex items-center">
                    <p>{namaAkun}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <BtnSecondary name="Edit" onClick={() => openCOA(noAkun)} />
                    <BtnSecondary name="Hapus" onClick={() => handleDeleteCoa(idCoa)} variant="text" textColor="text-red-500" />
                </div>
            </div>
        </div>
    )
}
