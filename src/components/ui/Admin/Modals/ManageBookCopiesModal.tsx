'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BookCopy, Room } from '@/src/types/bookDetail';
import { Book } from "@/src/types/book";
import { roomService } from '@/src/services/roomService';
import { bookService } from '@/src/services/bookService';

interface ManageCopiesProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onUpdate: () => void;
}

export default function ManageBookCopiesModal({ isOpen, onClose, book, onUpdate }: ManageCopiesProps) {
    // --- STATE ---
    const [allCopies, setAllCopies] = useState<BookCopy[]>([]); // TÜM VERİ BURADA
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);

    // UI States (Server'a gitmez, sadece görüntüyü değiştirir)
    const [page, setPage] = useState(1);
    const pageSize = 5; // Sayfa başı 5 kopya gösterelim
    const [sortField, setSortField] = useState<string>('barcodeNumber');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Editing States
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ roomId: 0, shelfCode: '' });

    // --- DATA FETCHING (Sadece Açılışta 1 Kere) ---
    useEffect(() => {
        if (isOpen && book) {
            fetchAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, book]);

    const fetchAllData = async () => {
        if (!book) return;
        setLoading(true);
        try {
            // Paralel istek atalım (Odalar ve Kopyalar)
            const [roomsData, copiesResult] = await Promise.all([
                roomService.getRooms(),
                // Backend'e "Bana hepsini ver" diyoruz (size: 1000)
                bookService.getCopiesByBookId({ bookId: book.id, page: 1, size: 1000 })
            ]);

            if (Array.isArray(roomsData)) setRooms(roomsData);
            // Gelen tüm kopyaları state'e atıyoruz
            setAllCopies(copiesResult.items || []);

        } catch (error) {
            console.error("Veri hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- CLIENT-SIDE LOGIC (Sihirli Kısım) ---

    // filteredAndSortedCopies: Her render'da değil, sadece dependency değişince çalışır.
    const visibleCopies = useMemo(() => {
        // 1. Sıralama (Sorting)
        const sorted = [...allCopies].sort((a: any, b: any) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            // İlişkili alanlar için özel kontrol (örn: roomCode)
            if (sortField === 'roomCode') {
                valueA = a.shelf?.room?.roomCode || '';
                valueB = b.shelf?.room?.roomCode || '';
            } else if (sortField === 'shelfCode') {
                valueA = a.shelf?.shelfCode || '';
                valueB = b.shelf?.shelfCode || '';
            }

            // String karşılaştırma
            if (typeof valueA === 'string') {
                return sortOrder === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
            // Sayısal karşılaştırma
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        });

        // 2. Sayfalama (Pagination)
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return sorted.slice(startIndex, endIndex);

    }, [allCopies, sortField, sortOrder, page]); // Bu değişkenler değişince yeniden hesapla

    // --- HANDLERS ---

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
        setPage(1); // Sıralama değişince sayfa 1'e dön
    };

    // CRUD İşlemleri (Backend'e gider ama başarılı olursa lokal listeyi de günceller)
    const handleSave = async (copyId: number) => {
        // ... (API isteği aynı) ...
        // Başarılı olursa tekrar fetch atmak yerine allCopies state'ini güncelle:
        setAllCopies(prev => prev.map(c =>
            c.id === copyId ? {
                ...c,
                shelf: { ...c.shelf, shelfCode: editForm.shelfCode, roomId: editForm.roomId, room: rooms.find(r => r.id === editForm.roomId)! }
            } : c
        ));
        setEditingId(null);
        onUpdate();
    };

    const handleDelete = async (copyId: number) => {
        if (!confirm("Silinsin mi?")) return;
        try {
            await bookService.deleteCopy(copyId);
            // Backend'e tekrar sormadan listeden çıkar (Optimistic Update)
            setAllCopies(prev => prev.filter(c => c.id !== copyId));
            onUpdate();
        } catch (e) { alert("Hata"); }
    };

    if (!isOpen || !book) return null;

    const totalPages = Math.ceil(allCopies.length / pageSize);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl border border-stone-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50 rounded-t-lg">
                    <div>
                        <h3 className="font-serif font-bold text-amber-950">Kopyaları Yönet</h3>
                        <p className="text-xs text-stone-500">{book.title} ({allCopies.length} Adet)</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 font-bold">✕</button>
                </div>

                {/* Content Table */}
                <div className="p-0 overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 text-stone-500 uppercase text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th onClick={() => handleSort('barcodeNumber')} className="px-6 py-3 cursor-pointer hover:bg-stone-100 select-none">
                                Barkod {sortField === 'barcodeNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('roomCode')} className="px-6 py-3 cursor-pointer hover:bg-stone-100 select-none">
                                Oda {sortField === 'roomCode' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('shelfCode')} className="px-6 py-3 cursor-pointer hover:bg-stone-100 select-none">
                                Raf {sortField === 'shelfCode' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {/* useMemo ile hesaplanan visibleCopies'i kullanıyoruz */}
                        {visibleCopies.map((copy) => {
                            const isEditing = editingId === copy.id;
                            return (
                                <tr key={copy.id} className="hover:bg-amber-50/20">
                                    <td className="px-6 py-4 font-mono text-stone-600">{copy.barcodeNumber}</td>

                                    {/* --- DÜZENLEME ALANLARI --- */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                className="border border-amber-300 rounded p-1 text-xs w-full"
                                                value={editForm.roomId}
                                                onChange={(e) => setEditForm({ ...editForm, roomId: Number(e.target.value) })}
                                            >
                                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name || r.roomCode}</option>)}
                                            </select>
                                        ) : (
                                            <span className="text-stone-800">{copy.shelf?.room?.roomCode}</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input type="text" className="border w-24 p-1 text-xs" value={editForm.shelfCode} onChange={e => setEditForm({...editForm, shelfCode: e.target.value})} />
                                        ) : (
                                            <span className="font-bold text-stone-700">{copy.shelf?.shelfCode}</span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {copy.isAvailable
                                            ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Müsait</span>
                                            : <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Ödünçte</span>
                                        }
                                    </td>

                                    {/* Butonlar */}
                                    <td className="px-6 py-4 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleSave(copy.id)} className="text-green-600 text-xs font-bold">Kaydet</button>
                                                <button onClick={() => setEditingId(null)} className="text-stone-400 text-xs">İptal</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setEditingId(copy.id); setEditForm({ roomId: copy.shelf.roomId, shelfCode: copy.shelf.shelfCode }) }} className="text-amber-700 text-xs">Düzenle</button>
                                                <button onClick={() => handleDelete(copy.id)} className="text-red-400 text-xs">Sil</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Client-Side Pagination Controls */}
                <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            ← Önceki
                        </button>
                        <span className="text-xs text-stone-600 font-medium">Sayfa {page} / {totalPages || 1}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            Sonraki →
                        </button>
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-sm font-medium">Kapat</button>
                </div>
            </div>
        </div>
    );
}