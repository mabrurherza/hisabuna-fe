'use client'

import Image from "next/image"

export default function ProfileHeader() {
    return (
        <header className="h-16 flex items-center justify-between m-4 mb-0">
            <div className="flex gap-2 items-center">
                <div className="size-12 relative rounded-lg overflow-hidden">
                    <Image src="/images/dummy-company.png" alt="dummy company" fill={true} />
                </div>
                <div>
                    <p className="text-xs">PROJECT</p>
                    <p className="text-lg">PT Insan Kreatif Cendekia</p>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <div className="">
                    <p className="text-xs uppercase text-right">Profile</p>
                    <p className="text-base hover:underline cursor-pointer">Muhammad Ihsan</p>
                </div>
                <div className="size-12 relative rounded-full overflow-hidden border-4 border-emerald-600 border-opacity-20 cursor-pointer">
                    <Image src="/images/dummy-profile.png" alt="dummy company" fill={true} />
                </div>

            </div>
        </header>
    )
}
