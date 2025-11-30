'use client';

import React from 'react';
import { BookDetail, BookCopy } from '@/src/types/bookDetail';

interface Props {
    book: BookDetail;
    onBorrowClick: (copyId: number, barcode: string) => void; // Parent'tan fonksiyon alıyoruz
}

const CopyStatusList = ({ book, onBorrowClick }: Props) => {
    const availableCount = book.bookCopies.filter(c => c.isAvailable).length;

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-amber-950">
                    Konum ve Durum Bilgisi
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${availableCount > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {availableCount > 0 ? `${availableCount} Adet Mevcut` : 'Tükendi / Ödünçte'}
                </span>
            </div>

            {book.bookCopies.length === 0 ? (
                <p className="text-stone-500 italic text-sm">Bu kitaba ait kopya kaydı bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-4 py-3">Barkod</th>
                            <th className="px-4 py-3">Oda / Raf</th>
                            <th className="px-4 py-3">Durum</th>
                            <th className="px-4 py-3 text-right">İşlem</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {book.bookCopies.map((copy) => (
                            <tr key={copy.id} className="hover:bg-amber-50/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-stone-600">{copy.barcodeNumber}</td>

                                <td className="px-4 py-3 text-stone-700">
                                    <div className="font-medium">{copy.shelf?.room?.roomCode}</div>
                                    <div className="text-xs text-stone-400">{copy.shelf?.shelfCode}</div>
                                </td>

                                <td className="px-4 py-3">
                                    {copy.isAvailable ? (
                                        <span className="inline-flex items-center gap-1 text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Rafta
                                            </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Ödünçte
                                            </span>
                                    )}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    {copy.isAvailable ? (
                                        <button
                                            onClick={() => onBorrowClick(copy.id, copy.barcodeNumber)}
                                            className="bg-amber-700 hover:bg-amber-800 text-amber-50 text-xs font-serif py-1.5 px-4 rounded shadow-sm transition-all active:scale-95"
                                        >
                                            Ödünç Al
                                        </button>
                                    ) : (
                                        <span className="text-stone-300 text-xs select-none">İşlem Yok</span>
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