'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '@/src/components/ui/Admin/StatCard'; // StatCard bileşenin olduğunu varsayıyorum

// --- TİP TANIMLARI ---
// (İleride src/types/user.ts içine taşıyabilirsin)
interface BannedUser {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    profileImage?: string;
    reason: string; // Ceza sebebi
    startDate: string; // YYYY-MM-DD
    endDate: string | null; // Null ise süresiz/kalıcı
    status: 'Active' | 'Expired';
    penaltyAmount?: number; // Varsa para cezası
}

// --- MOCK DATA ---
const MOCK_BANNED_USERS: BannedUser[] = [
    {
        id: 1, userId: 101, fullName: "Mehmet Yılmaz", email: "mehmet@gmail.com",
        reason: "Kitaplara zarar verme", startDate: "2023-11-01", endDate: null, status: "Active"
    },
    {
        id: 2, userId: 105, fullName: "Ayşe Kaya", email: "ayse@hotmail.com",
        reason: "Sürekli geç getirme (3+ defa)", startDate: "2023-11-20", endDate: "2023-12-20", status: "Active", penaltyAmount: 45
    },
    {
        id: 3, userId: 112, fullName: "Caner Erkin", email: "caner@test.com",
        reason: "Kütüphane kurallarına aykırı davranış", startDate: "2023-11-25", endDate: "2023-11-30", status: "Active"
    },
    {
        id: 4, userId: 120, fullName: "Zeynep Demir", email: "zeynep@site.com",
        reason: "Kaybolan kitap (Ödeme bekleniyor)", startDate: "2023-10-15", endDate: "2024-01-15", status: "Active", penaltyAmount: 150
    },
];

export default function BannedUsersPage() {
    const [users, setUsers] = useState<BannedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- VERİ ÇEKME SİMÜLASYONU ---
    useEffect(() => {
        // TODO: userService.getBannedUsers() servisi buraya bağlanacak
        const fetchData = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Loading efekti için bekleme
            setUsers(MOCK_BANNED_USERS);
            setLoading(false);
        };
        fetchData();
    }, []);

    // --- ARAMA FİLTRESİ ---
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- YARDIMCI FONKSİYONLAR ---

    // Kalan günü hesapla
    const getDaysRemaining = (endDate: string | null) => {
        if (!endDate) return "Süresiz";
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = Math.abs(end.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Tarih geçmişse
        if (end < today) return "Süresi Doldu";
        return `${diffDays} Gün`;
    };

    // Cezayı Kaldır İşlemi
    const handleRevokeBan = (id: number, name: string) => {
        if(confirm(`${name} kullanıcısının cezasını kaldırmak istediğinize emin misiniz?`)) {
            // TODO: await userService.revokeBan(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            alert("Ceza kaldırıldı.");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header ve İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-4 flex justify-between items-end mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 font-serif">Cezalı Üyeler</h1>
                        <p className="text-stone-500 text-sm">Ceza veya kısıtlama almış üyelerin yönetimi.</p>
                    </div>
                    <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                        ⚠️ Ceza Ata
                    </button>
                </div>

                {/* İstatistik Kartları */}
                <StatCard
                    title="Toplam Cezalı"
                    value={users.length}
                    icon="🚫"
                    trend="+2 bu hafta"
                    trendDirection="down" // Kötü bir şey olduğu için kırmızı/down
                />
                <StatCard
                    title="Süresiz Yasaklı"
                    value={users.filter(u => u.endDate === null).length}
                    icon="🔒"
                />
                <StatCard
                    title="Bekleyen Ödeme"
                    value={`${users.reduce((acc, curr) => acc + (curr.penaltyAmount || 0), 0)} TL`}
                    icon="💰"
                    trend="Tahsil edilecek"
                />
            </div>

            {/* Arama ve Tablo Alanı */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-stone-100 flex gap-4 bg-stone-50">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                        <input
                            type="text"
                            placeholder="İsim veya E-posta ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border text-black rounded text-sm focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <select className="border border-stone-300 rounded px-3 py-2 text-sm text-stone-600 focus:outline-none focus:border-amber-500 bg-white">
                        <option>Tüm Durumlar</option>
                        <option>Süresi Dolanlar</option>
                        <option>Kalıcı Yasaklar</option>
                    </select>
                </div>

                {/* Tablo */}
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-100 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3">Üye Bilgisi</th>
                        <th className="px-6 py-3">Ceza Sebebi</th>
                        <th className="px-6 py-3">Başlangıç</th>
                        <th className="px-6 py-3">Bitiş / Kalan</th>
                        <th className="px-6 py-3 text-center">Ceza Tutarı</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    {loading && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-stone-500">Yükleniyor...</td></tr>
                    )}

                    {!loading && filteredUsers.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-stone-500 italic">Cezalı üye bulunamadı.</td></tr>
                    )}

                    {!loading && filteredUsers.map((user) => {
                        const daysLeft = getDaysRemaining(user.endDate);
                        const isPermanent = user.endDate === null;

                        return (
                            <tr key={user.id} className="hover:bg-red-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-xs">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-stone-800">{user.fullName}</div>
                                            <div className="text-xs text-stone-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="text-stone-700 font-medium">{user.reason}</span>
                                </td>

                                <td className="px-6 py-4 text-stone-600">
                                    {user.startDate}
                                </td>

                                <td className="px-6 py-4">
                                    {isPermanent ? (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold border border-red-200">
                                                KALICI YASAK
                                            </span>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="text-stone-800 font-medium">{user.endDate}</span>
                                            <span className="text-xs text-amber-600 font-bold">({daysLeft} kaldı)</span>
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    {user.penaltyAmount ? (
                                        <span className="text-stone-800 font-mono font-bold">{user.penaltyAmount} TL</span>
                                    ) : (
                                        <span className="text-stone-400 text-xs">-</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleRevokeBan(user.id, user.fullName)}
                                        className="text-green-600 hover:text-green-800 font-medium text-xs border border-green-200 hover:bg-green-50 px-3 py-1 rounded transition-colors"
                                    >
                                        Cezayı Kaldır
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}