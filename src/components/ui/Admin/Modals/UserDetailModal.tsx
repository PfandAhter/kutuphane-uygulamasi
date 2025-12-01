'use client';

import React, { useState, useEffect } from 'react';
import { UserViewDto } from '@/src/types/user';
import { userService } from '@/src/services/userService'; // Servis importu

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserViewDto | null; // Listeden gelen özet kullanıcı
}

export default function UserDetailModal({ isOpen, onClose, user }: Props) {
    const [userDetail, setUserDetail] = useState<UserViewDto | null>(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setUserDetail(user);

            fetchUserDetail(user.id);
        }
    }, [isOpen, user]);

    const fetchUserDetail = async (id: string) => {
        setLoading(true);
        try {
            const data = await userService.getUserById(id);
            console.log("Kullanıcı Detayı:", data);
            setUserDetail(data);
        } catch (error) {
            console.error("Kullanıcı detayı çekilemedi", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !userDetail) return null;

    const formatDate = (dateString: string) => {
        if(!dateString) return "-";
        return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-stone-200 overflow-hidden relative" onClick={e => e.stopPropagation()}>

                {/* Loading Overlay (Veri güncellenirken şeffaf overlay) */}
                {loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 overflow-hidden">
                        <div className="h-full bg-amber-500 animate-progress origin-left"></div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center text-2xl font-bold font-serif uppercase">
                            {userDetail.firstName?.charAt(0)}{userDetail.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-stone-800">{userDetail.firstName} {userDetail.lastName}</h2>
                            <p className="text-stone-500 text-sm">{userDetail.email}</p>
                            <div className="flex gap-2 mt-2">
                                {userDetail.roles?.map(role => (
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
                            <p className="text-stone-800">{userDetail.phoneNumber || "-"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Doğum Tarihi</label>
                            <p className="text-stone-800">{formatDate(userDetail.dateOfBirth)}</p>
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Üyelik ID</label>
                            <p className="text-stone-800 font-mono text-xs break-all">{userDetail.id}</p>
                        </div>
                        {/* Eğer backend'den adres geliyorsa buraya eklenebilir */}
                        {/* <div>
                            <label className="text-xs text-stone-500 uppercase font-bold">Adres</label>
                            <p className="text-stone-800 text-sm">{userDetail.address || "Adres bilgisi yok"}</p>
                        </div> */}
                    </div>

                    {/* Kütüphane Durumu */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2 mb-2">Kütüphane Durumu</h3>

                        <div className="flex justify-between items-center bg-stone-50 p-3 rounded border border-stone-100">
                            <span className="text-stone-600 text-sm">Ödünçteki Kitaplar</span>
                            <span className="font-bold text-amber-900 text-lg">{userDetail.loanBookCount}</span>
                        </div>

                        <div className={`flex justify-between items-center p-3 rounded border ${userDetail.hasFine ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                            <span className="text-stone-600 text-sm">Ceza Durumu</span>
                            {userDetail.hasFine ? (
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
                            <button
                                onClick={() => alert("Ödünç geçmişi sayfasına yönlendirilecek...")}
                                className="w-full bg-stone-800 text-white py-2 rounded text-sm hover:bg-stone-900 transition shadow-sm"
                            >
                                📜 Ödünç Geçmişini Gör
                            </button>
                            {userDetail.hasFine && (
                                <button
                                    onClick={() => alert("Ödeme ekranı açılacak...")}
                                    className="w-full border border-red-200 text-red-700 py-2 rounded text-sm hover:bg-red-50 transition"
                                >
                                    💸 Cezayı Öde / Kaldır
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}