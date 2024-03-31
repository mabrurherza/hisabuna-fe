'use client'

import { useState } from "react"

export default function FilterBtn({ name, start, onClick, selected }) {
    const [pressed, setPressed] = useState(false);

    const handleClick = () => {
        setPressed(!pressed);
        onClick && onClick();
    };

    return (
        <div
            onClick={handleClick}
            className={`py-1 px-2 cursor-pointer rounded-sm ${selected ? "bg-emerald-600 text-white" : "text-zinc-400 hover:bg-emerald-50"}`}
        >
            <p>{name}</p>
        </div>
    );
}