'use client'

import useSWR from "swr";

export default function Playground() {
    const fetcher = async () => {
        const response = await fetch('https://hisabunapi.lokaldown.com/api/jurnal');
        const data = await response.json();
        return data;
    }

    const { data, error } = useSWR('jurnals', fetcher, {
        fallbackData: [],
    });

    // Destructure data directly
    const { data: dataArray } = data || {};

    // Check if dataArray is undefined
    if (!dataArray) {
        console.log("Data is undefined");
        return <div>Loading...</div>;
    }

    console.log(dataArray);

    if (error) return <div>Failed to load</div>;

    return (
        <div>
            {dataArray.map((i, index) => (
                <div key={index}>
                    <p>{i.voucher}</p>
                    <p>{i.trans_no}</p>
                    <p>{i.keterangan}</p>
                </div>
            ))}
        </div>
    );
}
