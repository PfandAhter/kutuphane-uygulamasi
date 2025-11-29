'use client';

import React from 'react';

const AdminHeader = () => {
    return (
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-40">

            {/* Sol: Global Arama (Admin içi) */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Admin panelinde ara (Üye, Kitap, ISBN)..."
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-700 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Sağ: Bildirimler ve Profil */}
            <div className="flex items-center gap-6">

                {/* Bildirim Zili */}
                <button className="relative text-stone-500 hover:text-amber-800 transition-colors">
                    <span className="text-xl">🔔</span>
                    {/* Bildirim sayısı badge'i */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Profil Alanı */}
                <div className="flex items-center gap-3 pl-6 border-l border-stone-200">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-stone-800">Admin Kullanıcısı</div>
                        <div className="text-xs text-stone-500">Süper Yönetici</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center font-bold border-2 border-amber-100">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;