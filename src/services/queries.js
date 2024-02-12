import useSWR from "swr";

export function fetchJournals() {
    return useSWR("/journals")
}


// https://jsonplaceholder.typicode.com/todos/1
