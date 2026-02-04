import { adminAuth } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Users, UserCheck, Settings } from 'lucide-react';

export default async function AdminLayout({ children }) {
    // Server-side verification of session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        redirect('/admin/login');
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        // Optional: Check if user has admin claim if using custom claims
    } catch (error) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">Election Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/admin/seats" icon={<Users size={20} />} label="Constituencies" />
                    <NavItem href="/admin/candidates" icon={<UserCheck size={20} />} label="Candidates" />
                    <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    {/* Logout Form usually needed or Client Component button */}
                    <form action="/api/auth/logout" method="POST">
                        <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 w-full px-4 py-2">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
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
