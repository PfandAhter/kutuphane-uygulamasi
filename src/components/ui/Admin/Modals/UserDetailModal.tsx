'use client';

import React from 'react';
import { UserViewDto } from '@/src/types/user';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserViewDto | null;
}

export default function UserDetailModal({ isOpen, onClose, user }: Props) {
    if (!isOpen || !user) return null;

    // Tarih Formatlama
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-stone-200 overflow-hidden">

                {/* Header */}
                <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center text-2xl font-bold font-serif">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-stone-800">{user.firstName} {user.lastName}</h2>
                            <p className="text-stone-500 text-sm">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                {user.roles.map(role => (
                                    <span key={role} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Kişisel Bilgiler */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-2">Kişisel Bilgiler</h3>
                        <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Telefon</label>
                            <p className="text-stone-800">{user.phoneNumber || "-"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Doğum Tarihi</label>
                            <p className="text-stone-800">{formatDate(user.dateOfBirth)}</p>
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Üyelik ID</label>
                            <p className="text-stone-800 font-mono text-xs">{user.id}</p>
                        </div>
                    </div>

                    {/* Kütüphane Durumu */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-2">Kütüphane Durumu</h3>

                        <div className="flex justify-between items-center bg-stone-50 p-3 rounded">
                            <span className="text-stone-600 text-sm">Ödünçteki Kitaplar</span>
                            <span className="font-bold text-amber-900 text-lg">{user.loanBookCount}</span>
                        </div>

                        <div className={`flex justify-between items-center p-3 rounded ${user.hasFine ? 'bg-red-50' : 'bg-green-50'}`}>
                            <span className="text-stone-600 text-sm">Ceza Durumu</span>
                            {user.hasFine ? (
                                <span className="font-bold text-red-700 flex items-center gap-1">
                                    🚫 Cezalı
                                </span>
                            ) : (
                                <span className="font-bold text-green-700 flex items-center gap-1">
                                    ✅ Temiz
                                </span>
                            )}
                        </div>

                        {/* Butonlar */}
                        <div className="pt-4 flex flex-col gap-2">
                            <button className="w-full bg-stone-800 text-white py-2 rounded text-sm hover:bg-stone-900 transition">
                                Ödünç Geçmişini Gör
                            </button>
                            {user.hasFine && (
                                <button className="w-full border border-red-200 text-red-700 py-2 rounded text-sm hover:bg-red-50 transition">
                                    Cezayı Öde / Kaldır
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}