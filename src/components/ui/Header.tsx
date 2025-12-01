"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Header = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('title', searchTerm);
        } else {
            params.delete('title');
        }
        router.push(`/?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        // Degisiklik 1: bg-blue-900 yerine bg-amber-950 (Koyu Maun/Ceviz Rengi)
        // border-b-amber-800 ile alt kisma hafif bir ahsap ayrimi ekledik
        <header className="bg-amber-950 text-amber-50 shadow-lg py-4 border-b-4 border-amber-900">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Logo Alani */}
                <div className="text-2xl font-serif font-bold tracking-wide cursor-pointer flex items-center gap-2" onClick={() => router.push('/')}>
                    {/* Ikon eklenebilir, simdilik yazi */}
                    <span className="text-amber-100">Kütüphane</span>
                    {/* Degisiklik 2: text-yellow-400 yerine text-amber-500 (Eskitme Altin Rengi) */}
                    <span className="text-amber-500 font-extrabold">App</span>
                </div>

                {/* Arama Kutusu */}
                <div className="flex-1 w-full max-w-2xl flex shadow-inner">
                    <input
                        type="text"
                        placeholder="Eser adı, yazar veya ISBN giriniz..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // Degisiklik 3: Arka plan bg-amber-50 (Saman Kagidi rengi), yazi rengi kahverengi
                        className="w-full px-4 py-2 bg-amber-50 text-amber-900 placeholder-amber-900/50 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-600 border border-transparent"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-amber-700 text-amber-100 font-serif font-semibold px-6 py-2 rounded-r-md hover:bg-amber-600 transition-colors border-l border-amber-800">
                        Ara
                    </button>
                </div>

                {/* Sag Menu (Giris/Kayit) */}
                <div className="hidden md:flex gap-4 text-sm font-medium">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-amber-200 hover:text-amber-50 transition font-serif">
                        Giriş Yap
                    </button>
                    {/* Degisiklik 4: Buton rengi krem (Kagide yakin), yazi rengi koyu kahve */}
                    <button
                        onClick={() => router.push('/register')}
                        className="bg-amber-100 text-amber-950 px-5 py-2 rounded shadow-md hover:bg-white transition-colors font-serif font-bold">
                        Kayıt Ol
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;