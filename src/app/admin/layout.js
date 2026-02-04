import Link from 'next/link';
import { LogOut, LayoutDashboard, Users, UserCheck, Settings, Home } from 'lucide-react';

export default function AdminLayout({ children }) {
    // Simple admin layout without authentication for now
    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">🗳️ Election Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/admin/scrape" icon={<Settings size={20} />} label="EC Scraper" />
                    <NavItem href="/results" icon={<Users size={20} />} label="Results" />
                    <NavItem href="/seats" icon={<UserCheck size={20} />} label="All Seats" />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <Link href="/" className="flex items-center space-x-3 text-green-400 hover:text-green-300 w-full px-4 py-2">
                        <Home size={20} />
                        <span>Go to Homepage</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 z-50">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold">🗳️ Admin</h1>
                    <Link href="/" className="text-green-400 text-sm">← Home</Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto md:mt-0 mt-16">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
