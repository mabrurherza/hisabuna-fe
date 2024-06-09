'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Alert } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import { useCookies } from 'react-cookie';

export default function LoginPage() {
    const router = useRouter()
    const [isAccountInvalid, setAccountInvalid] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isColor, setColor] = useState("");
    const [error, setError] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        if(localStorage.getItem('authToken')){
            router.push('/dashboard');
        }
    })

    const handleSignIn = async () => {
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {});
            console.log(email)
            console.log(password)
            const response = await axios.post("http://localhost:8000/api/login", {
                email: email,
                password: password
            });
            console.log(response)

            if(response.data.status == true){
                localStorage.setItem('authToken', response.data.access_token);
                setError(response.data.message);
                setColor("green");
                setAccountInvalid(true);

                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 3000);
            }else{
                setError(response.data.message);
                setColor("red");
                setAccountInvalid(true);
            }

        } catch (error) {
            setError(error);
            setColor("red");
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
                <div className="flex flex-col p-5 gap-5 w-full max-w-md">
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Button size="lg" className="w-full" onClick={handleSignIn}>Sign in</Button>
                    <Button variant="link"> Lupa password</Button>
                </div>

            </div>
        </main>
    )
}
