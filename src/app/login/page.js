'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
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
