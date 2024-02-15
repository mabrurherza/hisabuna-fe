'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Alert } from "@/components/ui/alert"
import { useState } from "react"

export default function LoginPage() {
    const [isAccountInvalid, setAccountInvalid] = useState(false)
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
                    {isAccountInvalid ? <div className="flex gap-2 border border-red-400 bg-red-100 p-2 rounded w-full">
                        <div className="border border-red-400 rounded-full size-5 text-xs text-red-400 font-bold grid place-items-center">!</div>
                        <p className="text-sm text-red-400">Email atau password salah.</p>
                    </div> : ``}

                </div>
                <div className="flex flex-col p-5 gap-5 w-full max-w-md">
                    <Input type="email" placeholder="Email" />
                    <Input type="password" placeholder="Password" />

                    <Link href={"/dashboard"}>
                        <Button size="lg" className="w-full">Sign in</Button>
                    </Link>
                    <Button variant="link"> Lupa password</Button>
                </div>

            </div>
        </main>
    )
}
