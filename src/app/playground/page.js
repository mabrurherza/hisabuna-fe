'use client'

import useSWR from "swr"
import IconCoa from "../components/icons/IconCOA"
// const fetcher = (url) => fetch(url).then(res => res.json())
const fetcher = (...args) => fetch(...args).then(res => res.json())

import { fetchJournals } from "../../services/queries"



export default function Playground() {

    const { data, error, isLoading } = useSWR("https://localhost:4000/journals", fetcher)

    if (error) return <div>failed</div>
    if (isLoading) return <div>loading....</div>

    const QueryJournals = fetchJournals()

    console.log(QueryJournals.data)


    return (
        <div>
            <div>tes</div>
        </div>
    )

}
