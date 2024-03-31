'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if(localStorage.getItem('authToken')){
        router.push('/dashboard');
    }
  })


  return (
    <>
      <navbar className="flex bg-white border border-b-zinc-200 p-10 h-24 items-center justify-between gap-12">
        <div className="flex gap-12 items-center">
          <div className="relative">
            <Image
              src={"/images/brand/logo-hisabuna-color.svg"}
              height={32}
              width={160}
              alt="logo hisabuna"
            />
          </div>
          <div>
            <ul className="flex gap-5">
              <li>About</li>
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>

        </div>

        <div className="flex gap-4">
          <Link href={"/login"}>
            <button className="hover:bg-emerald-200 border border-emerald-500 py-2 px-5 rounded">Sign in</button></Link>
          <Link href={"/register"}>
            <button className="hover:bg-emerald-700 bg-emerald-500 text-white border border-emerald-500 py-2 px-5 rounded">Register</button></Link>
        </div>
      </navbar>

      <main className="bg-emerald-50 h-[720px] items-center justify-center">
        <div className="flex items-center h-full">
          <div className="flex-1 p-20">
            <h1 className="text-6xl mb-5 text-emerald-800">Effortless Accounting, Elevated Results.</h1>
            <p className="max-w-xl mb-10">Simplify your financial journey with our intuitive Accounting App. Streamline processes, enhance accuracy, and drive your business forward. Get started today for a smarter, more efficient approach to financial management.</p>
            <Link href={"/login"}>
              <button className="bg-emerald-500 hover:bg-emerald-700 text-white text-xl px-8 py-4 rounded">Get Hisabuna</button>
            </Link>
          </div>
          <div className="flex-1">
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
              <img src="/images/mockup-hisabuna-v01.png" alt="Hisabuna mockup" />

            </div>

          </div>
        </div>
      </main>
    </>

  );
}
