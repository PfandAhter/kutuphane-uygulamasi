'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-stone-500 hover:text-amber-800 text-sm mb-2 flex items-center gap-1"
                >
                    ← Listeye Dön
                </button>
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Yeni Kitap Kaydı</h1>
                <p className="text-stone-500 text-sm">Kütüphane envanterine yeni bir kitap ekleyin.</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-8">
                <form className="space-y-6">

                    {/* Temel Bilgiler Bölümü */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Kitap Adı</label>
                            <input type="text" className="w-full border border-stone-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" placeholder="Örn: Nutuk" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">ISBN</label>
                            <input type="text" className="w-full border border-stone-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" placeholder="978-..." />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yazar Seçimi</label>
                            <select className="w-full border border-stone-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white">
                                <option>Yazar Seçiniz...</option>
                                <option>Mustafa Kemal Atatürk</option>
                                <option>Sabahattin Ali</option>
                            </select>
                            <div className="mt-1 text-xs text-amber-700 cursor-pointer hover:underline">+ Yeni Yazar Ekle</div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yayınevi</label>
                            <select className="w-full border border-stone-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white">
                                <option>Yayınevi Seçiniz...</option>
                                <option>Yapı Kredi Yayınları</option>
                                <option>İş Bankası Kültür Yayınları</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Yayın Yılı</label>
                            <input type="number" className="w-full border border-stone-300 rounded-md p-2.5 focus:border-amber-500 outline-none" placeholder="2024" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Sayfa Sayısı</label>
                            <input type="number" className="w-full border border-stone-300 rounded-md p-2.5 focus:border-amber-500 outline-none" placeholder="350" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Dil</label>
                            <select className="w-full border border-stone-300 rounded-md p-2.5 focus:border-amber-500 outline-none bg-white">
                                <option>Türkçe</option>
                                <option>İngilizce</option>
                            </select>
                        </div>
                    </div>

                    {/* Konum Bilgisi (Raf/Oda) */}
                    <div className="bg-stone-50 p-4 rounded-md border border-stone-200">
                        <h3 className="font-bold text-amber-900 mb-4 text-sm border-b border-stone-200 pb-2">Konum Bilgisi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Oda</label>
                                <select className="w-full border border-stone-300 rounded p-2 text-sm">
                                    <option>A Blok - Tarih Odası</option>
                                    <option>B Blok - Edebiyat Odası</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Raf Kodu</label>
                                <select className="w-full border border-stone-300 rounded p-2 text-sm">
                                    <option>R-101</option>
                                    <option>R-102</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4 border-t border-stone-100">
                        <button type="button" className="text-stone-500 hover:text-stone-800 font-medium text-sm">İptal</button>
                        <button type="submit" className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-2.5 rounded-md font-serif font-medium shadow-md transition-all transform active:scale-95">
                            Kaydet
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}