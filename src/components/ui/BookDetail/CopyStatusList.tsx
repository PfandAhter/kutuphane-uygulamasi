'use client';

import React from 'react';
import { BookDetail } from '@/src/types/bookDetail';

interface Props {
    book: BookDetail;
}

const CopyStatusList = ({ book }: Props) => {
    // Toplam stok ve müsait stok hesaplama
    const totalCopies = book.bookCopies.length;
    const availableCopies = book.bookCopies.filter(c => c.isAvailable).length;

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-amber-950">
                    Konum ve Durum Bilgisi
                </h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-stone-50 border-stone-200 text-stone-600">
                        Toplam: {totalCopies}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${availableCopies > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {availableCopies > 0 ? `${availableCopies} Adet Mevcut` : 'Tükendi'}
                    </span>
                </div>
            </div>

            {book.bookCopies.length === 0 ? (
                <p className="text-stone-500 italic text-sm">Bu kitaba ait kopya kaydı bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-4 py-3">Oda / Salon</th>
                            <th className="px-4 py-3">Raf Kodu</th>
                            <th className="px-4 py-3 text-right">Durum</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {book.bookCopies.map((copy) => (
                            <tr key={copy.id} className="hover:bg-amber-50/30 transition-colors">
                                {/* Oda Bilgisi */}
                                <td className="px-4 py-3 font-medium text-amber-900">
                                    {copy.shelf?.room?.roomCode}
                                    <span className="text-stone-400 font-normal ml-1 hidden sm:inline">
                                        ({copy.shelf?.room?.description})
                                    </span>
                                </td>

                                {/* Raf Bilgisi */}
                                <td className="px-4 py-3 font-bold text-stone-800">
                                    {copy.shelf?.shelfCode}
                                </td>

                                {/* Durum */}
                                <td className="px-4 py-3 text-right">
                                    {copy.isAvailable ? (
                                        <span className="inline-flex items-center gap-1 text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Rafta
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Ödünçte
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CopyStatusList;