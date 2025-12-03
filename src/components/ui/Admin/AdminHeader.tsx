'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminHeader = () => {
    const router = useRouter();

    return (
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-40 gap-8">

            <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3 group shrink-0"
                title="Site Ana Sayfasına Dön"
            >
                <div className="w-9 h-9 bg-amber-950 text-amber-50 flex items-center justify-center rounded-lg font-serif font-bold text-xl shadow-sm group-hover:bg-amber-900 transition-all">
                    K
                </div>

                <div className="flex flex-col items-start leading-tight">
                    <span className="font-serif font-bold text-stone-800 text-lg tracking-tight group-hover:text-amber-900 transition-colors">
                        Kütüphane
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider group-hover:text-amber-700 transition-colors flex items-center gap-1">
                        <span>←</span> Siteye Dön
                    </span>
                </div>
            </button>

            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Admin panelinde ara (Üye, Kitap, ISBN)..."
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-400"
                    />
                    {/* Arama Kısayolu İpucu (Opsiyonel UI Süsü)
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                        <kbd className="hidden sm:inline-block min-h-[20px] px-1.5 py-0.5 text-[10px] font-bold text-stone-400 bg-white border border-stone-200 rounded shadow-[0px_2px_0px_0px_rgba(0,0,0,0.05)]">Ctrl</kbd>
                        <kbd className="hidden sm:inline-block min-h-[20px] px-1.5 py-0.5 text-[10px] font-bold text-stone-400 bg-white border border-stone-200 rounded shadow-[0px_2px_0px_0px_rgba(0,0,0,0.05)]">K</kbd>
                    </div> */}
                </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-3 pl-5 border-l border-stone-200 h-8">
                    <div className="text-right hidden lg:block leading-tight">
                        <div className="text-sm font-bold text-stone-800">Admin Kullanıcısı</div>
                        <div className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Süper Yönetici</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 text-amber-50 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;