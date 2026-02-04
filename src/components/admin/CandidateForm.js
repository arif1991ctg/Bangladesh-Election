'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CandidateForm({ seats }) {
    const [formData, setFormData] = useState({
        name: '',
        party: '',
        symbol: '',
        seatId: '',
    });
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photo) {
            toast.error("Candidate photo is required");
            return;
        }

        setLoading(true);

        try {
            // 1. Upload Photo
            const storageRef = ref(storage, `candidates/${Date.now()}_${photo.name}`);
            const snapshot = await uploadBytes(storageRef, photo);
            const photoUrl = await getDownloadURL(snapshot.ref);

            // 2. Add to Firestore (using Client SDK authenticated as Admin if rules allow, 
            // BUT rules above said candidates write: false. 
            // We need an API route for creating candidates or update rules to allow authenticated admin write.
            // My rules said `allow write: if false;` for candidates. 
            // So I MUST use an API route OR update rules.
            // Easiest is to use API Route `/api/admin/candidates`.

            // I will update this to call API instead of direct DB write.
            // Uploading file to Storage: Storage rules match default (auth != null). I need to check storage rules.
            // Assuming storage is open for Auth users or I need to update it.
            // Default storage rules usually require auth. Admin is auth'd.

            const payload = {
                ...formData,
                photoUrl,
                voteCount: 0,
                createdAt: new Date().toISOString() // API will handle timestamp better
            };

            const res = await fetch('/api/admin/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create candidate');

            toast.success("Candidate created successfully!");
            router.push('/admin/candidates');
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Party Name</label>
                    <input
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        value={formData.party}
                        onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Election Symbol</label>
                    <input
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                        value={formData.symbol}
                        placeholder="e.g. Boat, Sheaf of Paddy"
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Constituency</label>
                    <select
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                        value={formData.seatId}
                        onChange={(e) => setFormData({ ...formData, seatId: e.target.value })}
                    >
                        <option value="">Select Seat</option>
                        {seats.map(seat => (
                            <option key={seat.id} value={seat.id}>{seat.name} ({seat.number})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Candidate Photo</label>
                <div className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition",
                    photo ? "border-green-500 bg-green-50" : "border-slate-300 hover:border-slate-400"
                )}>
                    <input
                        type="file"
                        id="photoUrl"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="photoUrl" className="cursor-pointer flex flex-col items-center justify-center">
                        {photo ? (
                            <>
                                <img src={URL.createObjectURL(photo)} className="w-20 h-20 object-cover rounded-full mb-2" />
                                <span className="text-sm text-green-700 font-medium">{photo.name}</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500">Click to upload photo</span>
                            </>
                        )}
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Candidate'}
                </button>
            </div>
        </form>
    );
}
