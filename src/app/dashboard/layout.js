import Sidebar from "./components/Sidebar"
import ProfileHeader from "./components/ProfileHeader"

export default function DashboardLayout({ children }) {
    return (
        <div className="bg-zinc-50 h-dvh">
            <div className="flex h-full">
                <Sidebar />
                <div className="flex gap-0 flex-col w-full">
                    <ProfileHeader />
                    <main className="flex-1 h-full rounded-xl p-4 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
