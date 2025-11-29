'use client';

import React from 'react';

// İstatistik Kartı Componenti
const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="bg-white p-6 rounded-lg border border-amber-200/60 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-stone-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-amber-950 font-serif">{value}</h3>
            <span className="text-xs text-green-600 font-bold mt-2 inline-block bg-green-50 px-2 py-0.5 rounded">
                {trend}
            </span>
        </div>
        <div className="p-3 bg-stone-100 rounded-lg text-2xl border border-stone-200">
            {icon}
        </div>
    </div>
);

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Genel Bakış</h1>
                <p className="text-stone-500 text-sm">Kütüphane durumunun anlık özeti.</p>
            </div>

            {/* İstatistikler Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Kitap" value="12,450" icon="📚" trend="+12 bu hafta" />
                <StatCard title="Aktif Üyeler" value="840" icon="👥" trend="+5 yeni üye" />
                <StatCard title="Ödünçteki Kitaplar" value="124" icon="⏳" trend="%12 doluluk" />
                <StatCard title="Geciken İadeler" value="8" icon="⚠️" trend="Dikkat" />
            </div>

            {/* Son Hareketler Tablosu (Örnek) */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="font-bold text-stone-800">Son İşlemler</h3>
                    <button className="text-xs text-amber-700 font-bold hover:underline">Tümünü Gör</button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Üye</th>
                        <th className="px-6 py-3">İşlem</th>
                        <th className="px-6 py-3">Tarih</th>
                        <th className="px-6 py-3">Durum</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    <tr className="hover:bg-stone-50">
                        <td className="px-6 py-4 font-medium text-stone-800">Ahmet Yılmaz</td>
                        <td className="px-6 py-4">Suç ve Ceza (Ödünç Alma)</td>
                        <td className="px-6 py-4 text-stone-500">10 Dk önce</td>
                        <td className="px-6 py-4"><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">Başarılı</span></td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                        <td className="px-6 py-4 font-medium text-stone-800">Mehmet Demir</td>
                        <td className="px-6 py-4">Nutuk (İade)</td>
                        <td className="px-6 py-4 text-stone-500">1 Saat önce</td>
                        <td className="px-6 py-4"><span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">İnceleniyor</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}