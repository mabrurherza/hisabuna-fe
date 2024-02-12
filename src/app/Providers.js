"use client"

import fetcher from "@/services/fetcher";
import { SWRConfig } from "swr";

export default function Providers({ children }) {
    return (
        <SWRConfig
            value={{ fetcher, refreshInterval: 1000 }}>
            {children}
        </SWRConfig>)
}
