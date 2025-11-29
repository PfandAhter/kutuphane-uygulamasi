'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Menü verisi için tip tanımı
interface MenuItem {
    title: string;
    icon: string;
    path?: string; // Eğer alt menüsü varsa path zorunlu değil
    subItems?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
    {
        title: 'Genel Bakış',
        icon: '📊',
        path: '/admin'
    },
    {
        title: 'Kitap İşlemleri',
        icon: '📚',
        // path yok, çünkü bu bir açılır menü başlığı
        subItems: [
            { title: 'Kitap Listesi', path: '/admin/books' },
            { title: 'Yeni Kitap Ekle', path: '/admin/books/add' },
            // { title: 'Toplu Güncelleme', path: '/admin/books/bulk-edit' } // Örnek
        ]
    },
    {
        title: 'Üye Yönetimi',
        icon: '👥', // "U" yerine daha uygun bir ikon
        subItems: [
            { title: 'Üye Listesi', path: '/admin/users' },
            { title: 'Cezalı Üyeler', path: '/admin/users/banned' },
            // { title: 'Personel Ekle', path: '/admin/users/add-staff' }
        ]
    },
    {
        title: 'Ödünç & İade',
        icon: '⏳',
        subItems: [
            { title: 'Aktif Ödünçler', path: '/admin/loans' },
            { title: 'Geçmiş İşlemler', path: '/admin/loans/history' },
            { title: 'Gecikmiş İadeler', path: '/admin/loans/overdue' }
        ]
    },
    {
        title: 'Yerleşim (Raf)',
        icon: '🗄️',
        subItems: [
            { title: 'Odalar ve Raflar', path: '/admin/shelves' },
            { title: 'Yeni Raf Ekle', path: '/admin/shelves/add' }
        ]
    }
];

const AdminSidebar = () => {
    const pathname = usePathname();

    // Hangi menülerin açık olduğunu tutan state (Key: Menü Başlığı)
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Sayfa yüklendiğinde veya değiştiğinde aktif olan alt menünün üstünü aç
    useEffect(() => {
        const newOpenMenus = { ...openMenus };

        menuItems.forEach(item => {
            if (item.subItems) {
                // Eğer alt menülerden biri şu anki sayfadaysa, ana menüyü aç
                const isChildActive = item.subItems.some(sub => pathname === sub.path);
                if (isChildActive) {
                    newOpenMenus[item.title] = true;
                }
            }
        });

        setOpenMenus(newOpenMenus);
    }, [pathname]);

    // Menü açma/kapama fonksiyonu
    const toggleMenu = (title: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col h-screen fixed left-0 top-0 border-r border-stone-800 shadow-xl z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700">
            {/* Header Kısmı */}
            <div className="p-6 border-b border-stone-800 shrink-0">
                <h2 className="text-xl font-serif font-bold text-amber-500">
                    Kütüphane<span className="text-stone-100">Panel</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">Yönetim Sistemi v1.0</p>
            </div>

            {/* Menü Listesi */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    // Bu öğenin alt menüsü var mı?
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    // Bu menü şu an açık mı?
                    const isOpen = openMenus[item.title];
                    // Bu menünün kendisi (alt menü değil) aktif mi? (Genel Bakış gibi)
                    const isDirectActive = !hasSubItems && pathname === item.path;

                    return (
                        <div key={item.title} className="mb-1">
                            {/* Ana Menü Öğesi */}
                            <div
                                onClick={() => hasSubItems ? toggleMenu(item.title) : null}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 cursor-pointer select-none group
                                    ${isDirectActive
                                    ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                                    : 'hover:bg-stone-800 hover:text-stone-100'}
                                `}
                            >
                                {/* Eğer alt menü yoksa Link, varsa div gibi davranmalı */}
                                {hasSubItems ? (
                                    <div className="flex items-center gap-3 w-full">
                                        <span className="text-lg opacity-80 group-hover:opacity-100">{item.icon}</span>
                                        <span className="font-medium text-sm flex-1">{item.title}</span>
                                        {/* Ok İkonu (Döndürme Animasyonlu) */}
                                        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                ) : (
                                    <Link href={item.path!} className="flex items-center gap-3 w-full">
                                        <span className="text-lg opacity-80 group-hover:opacity-100">{item.icon}</span>
                                        <span className="font-medium text-sm">{item.title}</span>
                                    </Link>
                                )}
                            </div>

                            {/* Alt Menüler (Conditional Rendering) */}
                            {hasSubItems && isOpen && (
                                <div className="mt-1 ml-4 border-l-2 border-stone-800 pl-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                    {item.subItems!.map((sub) => {
                                        const isSubActive = pathname === sub.path;
                                        return (
                                            <Link
                                                key={sub.path}
                                                href={sub.path}
                                                className={`
                                                    block px-3 py-2 rounded-md text-sm transition-colors
                                                    ${isSubActive
                                                    ? 'text-amber-400 font-medium bg-stone-800/50'
                                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'}
                                                `}
                                            >
                                                {sub.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Alt Footer / Çıkış */}
            <div className="p-4 border-t border-stone-800 shrink-0">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors text-sm font-medium">
                    <span>🚪</span> Çıkış Yap
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;