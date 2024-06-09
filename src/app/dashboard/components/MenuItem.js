'use client'
import Link from "next/link"

export default function MenuItem({ menuName, color = "zinc-500", icon = "ic-no-icon", link = "/dashboard", pathName, onClick, readonly = false }) {
    console.log(pathName)
    return (
        <Link href={`${link}`}>
            <div className={`p-2 flex gap-2 rounded-md cursor-pointer items-center ${pathName == link ? "bg-emerald-500 text-white" : ""} ${readonly ? "pointer-events-none opacity-50" : "hover:bg-zinc-200"}`} onClick={onClick}>
                <div className="size-7 grid place-items-center">
                    <div className={`mix-blend-lighten size-6 absolute bg-${color}`}></div>
                    <img src={`/images/icons/${icon}.svg`} alt="" className="size-5" />
                </div>
                <p className="text-base tracking-normal leading-normal">{menuName}</p>
            </div>
        </Link>
    )
}
