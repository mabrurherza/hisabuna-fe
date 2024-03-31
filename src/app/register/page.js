'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"

export default function RegisterPage() {
    const router = useRouter()
    const [isAccountInvalid, setAccountInvalid] = useState(false);
    const [isSerialKey, setSerial] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isColor, setColor] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [serial_key, setSerialKey] = useState("");
    const [token, setToken] = useState({});

    axios.defaults.withCredentials = true;

    useEffect(() => {
        if(localStorage.getItem('authToken')){
            router.push('/dashboard');
        }

        const checkKey = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_URLPROD + "/api/check");
                console.log(response.data)
                setSerial(response.data.status);
                console.log(response.data.status)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error:', error);
            }
        };

        checkKey();
    }, [router]);

    function getCookie(name) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        
        return null;
    }

    const handleSignUp = async () => {
        const cookie = getCookie('XSRF-TOKEN')
        if(password !== confirm_password) {
            setError("Password tidak sama");
            setAccountInvalid(true);
            return;
        }

        try {
            let response;
            await axios.get(process.env.NEXT_PUBLIC_URLPROD + "/sanctum/csrf-cookie", {});
            if(isSerialKey){
                response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + "/api/register", {
                    name: name,
                    email: email,
                    password: password,
                    confirm_password: confirm_password
                });
            }else{
                response = await axios.post(process.env.NEXT_PUBLIC_URLPROD + "/api/register", {
                    name: name,
                    email: email,
                    password: password,
                    confirm_password: confirm_password,
                    serial_key: serial_key
                }, {
                    headers: {
                        Cook: `Bearer ${cookie}`
                    }
                });
            }

            if(response.data.status == false){
                setError(response.data.message);
                setColor("red")
                setAccountInvalid(true);
                return;
            }else{
                setError(response.data.message);
                setColor("green")
                setAccountInvalid(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
            
        } catch (error) {
            console.log(error);
            setAccountInvalid(true);
        }
    };
    

    return (
        <main className="flex h-screen w-full">
            <div className="flex-1 bg-emerald-500 flex items-center justify-center">
                <img className="max-w-md" src="/images/login-artwork.png" alt="Login artwork Hisabuna" />
            </div>
            <div className="flex-1 flex flex-col bg-emerald-50 items-center justify-center">
                <div className="w-full p-5 max-w-md grid place-items-center">
                    <div className="relative">
                        <Image
                            src={"/images/brand/logo-hisabuna-color.svg"}
                            height={32}
                            width={120}
                            alt="logo hisabuna"
                        />
                    </div>
                </div>
                <div className="h-16 flex items-center w-full px-5 py-2 max-w-md">
                    {isAccountInvalid && (
                        <div className={`flex gap-2 border border-${isColor}-400 bg-${isColor}-100 p-2 rounded w-full`}>
                            <div className={`border border-${isColor}-400 rounded-full size-5 text-xs text-${isColor}-400 font-bold grid place-items-center`}>!</div>
                            <p className={`text-sm text-${isColor}-400`}>{error}</p>
                        </div>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col p-5 gap-5 w-full max-w-md">
                        <Input type="name" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input type="password" placeholder="Confirm Password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {!isSerialKey && (
                            <Input type="text" placeholder="Serial Key" value={serial_key} onChange={(e) => setSerialKey(e.target.value)} />
                        )}
                        <Button size="lg" className="w-full" onClick={handleSignUp}>Sign up</Button>
                        <Button variant="link"> Lupa password</Button>
                    </div>
                )}

            </div>
        </main>
    )
}
