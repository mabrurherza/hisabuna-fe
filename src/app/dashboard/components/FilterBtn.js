'use client'

import { useState } from "react"

export default function FilterBtn({ name, start = true }) {
    const [pressed, setPressed] = useState(false)

    const action = function () {
        setPressed(!pressed)
    }

    return (
        <div onClick={action} className={` py-1 px-2  cursor-pointer rounded-sm ${pressed || start ? "bg-emerald-600 text-white" : "text-zinc-400 hover:bg-emerald-50"}`}><p>{name}</p></div>

    )
}
