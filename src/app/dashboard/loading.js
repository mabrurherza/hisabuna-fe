export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 h-full bg-white rounded-xl border border-zinc-200 overflow-y-hidden">
            <div className="width-[64px] height-[64px] object-cover">
                <img className="w-full h-full" src="/images/loading-spinner.gif" alt="loading spinner" />
            </div>
        </div>
    )
}
