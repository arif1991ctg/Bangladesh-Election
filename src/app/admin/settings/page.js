'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, Power } from 'lucide-react';

export default function SettingsPage() {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch current status
        // For now we assume we can fetch public config or protected API
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                setIsActive(data.isActive);
                setLoading(false);
            });
    }, []);

    const toggleElection = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive })
            });

            if (res.ok) {
                setIsActive(!isActive);
                toast.success(`Election ${!isActive ? 'Started' : 'Stopped'} Successfully`);
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="max-w-xl mx-auto">
            <Toaster />
            <h1 className="text-2xl font-bold text-slate-800 mb-8">System Settings</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">Election Status</h3>
                        <p className="text-slate-500 text-sm">Control the global availability of voting.</p>
                    </div>

                    <button
                        onClick={toggleElection}
                        disabled={saving}
                        className={`w-16 h-8 rounded-full transition-colors relative ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${isActive ? 'left-9' : 'left-1'}`} />
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className={`p-4 rounded-lg flex items-center space-x-3 ${isActive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <Power size={20} />
                        <span className="font-bold">
                            The election is currently {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
