import React from 'react'

export default function ErrorAlert({ errorName }) {
    return (
        <div className='w-full h-full grid place-items-center'>
            <div className="flex gap-2 border border-red-400 bg-red-100 p-2 rounded">
                <div className="border border-red-400 rounded-full size-5 text-xs text-red-400 font-bold grid place-items-center">!</div>
                <p className="text-sm text-red-400">{errorName}</p>
            </div>
        </div>
    )
}
