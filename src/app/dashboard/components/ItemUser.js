import BtnSecondary from "../../components/BtnSecondary";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

function ModalUser({ closeUser, dataUser, token, companyList, id }) {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [data, setData] = useState({});

    useEffect(() => {
        setData(dataUser);
        setFormData(dataUser)
    }, [dataUser]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(id){
            const addForm = {
                company_id: formData.company_id.company_name ? formData.company_id.company_name : data.company_id.id,
                name: formData.name ? formData.name : data.name,
                email: formData.email ? formData.email : data.email,
                foto_profil: formData.foto_profil ? formData.foto_profil : data.foto_profil,
                password: formData.password,
            }

            console.log(addForm)

            try {
                const response = await axios.patch(process.env.NEXT_PUBLIC_URLPROD + `/api/users/${data.id}`, addForm, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response)

                if (response.status !== 200) {
                    throw new Error('Failed to submit form');
                }

                closeUser();
                router.push('/dashboard/users')
            } catch (error) {
                console.error('Error submitting form:', error.message);
            }
        }
    };

    console.log(formData);

    return (
        <div className='fixed left-0 top-0 z-50 w-full h-full bg-black bg-opacity-85 flex justify-center items-center'>
            <div className='bg-white max-w-lg p-6 w-full sm:max-w-md rounded-lg border border-zinc-300'>
                <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-4">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                    <select
                        id="company"
                        name="company_id"
                        value={formData.company_id ? formData.company_id.id : ''}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select Company</option>
                        {companyList.map((company) => (
                            <option key={company.id} value={company.id}>{company.company_name}</option>
                        ))}
                    </select>
                </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="foto_profil" className="block text-sm font-medium text-gray-700">Foto Profil</label>
                        <input
                            type="text"
                            id="foto_profil"
                            name="foto_profil"
                            value={formData.foto_profil || ''}
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleInputChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                        <button type="button" onClick={closeUser} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ItemUser({ dataUser ,token , id, name, company, companyList, email, foto_profil}) {
    const router = useRouter();
    const [isOpenUser, setIsOpenUser] = useState(false);
    const [akunUser, setAkunUser] = useState("");

    const openUser = (akun) => {
        setAkunUser(akun);
        setIsOpenUser(true);
    };

    const closeUser = () => {
        setIsOpenUser(false);
    };

    const handleDeleteUser = (id) => {
        fetch(process.env.NEXT_PUBLIC_URLPROD + `/api/users/destroy/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat menghapus User');
            }
            handleItemClick(id);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    };

    const handleItemClick = (user) => {
        selectData(user);
    };

    return (
        <div className="h-fit border-b border-b-zinc-300 px-4 py-3 flex items-center">
            {isOpenUser && <ModalUser closeUser={closeUser} companyList={companyList} dataUser={dataUser} token={token} id={akunUser}/>}
            <div className="flex w-full">
                <div className=" flex w-2/3 justify-between items-center">
                    <div className="flex-1">
                        <p>{name}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{company}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{email}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p>{foto_profil}</p>
                    </div>
                </div>
                <div className="flex-1 pl-5 flex items-center justify-center">
                    <BtnSecondary name="Edit" onClick={() => openUser(id)} />
                    <BtnSecondary name="Hapus" onClick={() => handleDeleteUser(id)} variant="text"textColor="text-red-500" />
                </div>
            </div>
        </div>
    );
}
