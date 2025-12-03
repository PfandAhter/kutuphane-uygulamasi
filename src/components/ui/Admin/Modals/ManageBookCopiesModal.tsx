'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BookCopy } from '@/src/types/bookDetail';
import { Room, Shelf } from '@/src/types/roomAndShelf';
import { Book } from "@/src/types/book";
import { roomService } from '@/src/services/roomService';
import { shelfService } from '@/src/services/shelfService';
import { bookCopyService } from '@/src/services/bookCopyService';

interface ManageCopiesProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onUpdate: () => void;
}

export default function ManageBookCopiesModal({ isOpen, onClose, book, onUpdate }: ManageCopiesProps) {
    // --- STATE ---
    const [copies, setCopies] = useState<BookCopy[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [availableShelves, setAvailableShelves] = useState<Shelf[]>([]);

    const [loading, setLoading] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Editing State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ roomId: 0, shelfCode: '' });

    useEffect(() => {
        if (isOpen && book) {
            setPage(1);
            fetchInitialData();
        }
    }, [isOpen, book]);

    useEffect(() => {
        if (isOpen && book) {
            fetchCopies(page);
        }
    }, [page]);

    useEffect(() => {
        if (editingId && editForm.roomId > 0) {
            fetchShelvesForEdit(editForm.roomId);
        }
    }, [editForm.roomId, editingId]);


    // --- API CALLS ---

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Odaları bir kere çekelim (select box için)
            const roomData = await roomService.getRooms();
            if(Array.isArray(roomData)) setRooms(roomData);

            // İlk sayfa kopyaları çek
            await fetchCopies(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCopies = async (pageNum: number) => {
        if (!book) return;
        try {
            const result = await bookCopyService.getCopiesByBookId(book.id, pageNum, pageSize);
            setCopies(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            toast.error("Kopyalar yüklenemedi.");
        }
    };

    const fetchShelvesForEdit = async (roomId: number) => {
        try {
            const shelves = await shelfService.getShelvesByRoomId(roomId);
            if(Array.isArray(shelves)) setAvailableShelves(shelves);
        } catch (error) {
            console.error("Raflar yüklenemedi");
        }
    };

    // --- HANDLERS ---

    const handleEditClick = (copy: BookCopy) => {
        setEditingId(copy.id);
        setEditForm({
            roomId: copy.shelf?.roomId || 0,
            shelfCode: copy.shelf?.shelfCode || ''
        });
        if(copy.shelf?.roomId) fetchShelvesForEdit(copy.shelf.roomId);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ roomId: 0, shelfCode: '' });
    };

    const handleSave = async (copyId: number) => {
        if (editForm.roomId === 0 || !editForm.shelfCode) {
            return toast.error("Lütfen oda ve raf seçiniz.");
        }

        try {
            await bookCopyService.updateCopy({
                id: copyId,
                roomId: editForm.roomId,
                shelfCode: editForm.shelfCode,
                isAvailable: true
            });

            toast.success("Kopya güncellendi.");
            setEditingId(null);
            fetchCopies(page);
            onUpdate();
        } catch (error) {
            toast.error("Güncelleme başarısız.");
        }
    };

    const handleDelete = async (copyId: number) => {
        if (!confirm("Bu kopya kalıcı olarak silinecek. Emin misiniz?")) return;
        try {
            await bookCopyService.deleteCopy(copyId);
            toast.success("Kopya silindi.");
            // Eğer sayfadaki son elemanı sildiysek bir önceki sayfaya git
            if (copies.length === 1 && page > 1) {
                setPage(p => p - 1);
            } else {
                fetchCopies(page);
            }
            onUpdate();
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    if (!isOpen || !book) return null;

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl border border-stone-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50 rounded-t-lg">
                    <div>
                        <h3 className="font-serif font-bold text-amber-950">Kopyaları Yönet</h3>
                        <p className="text-xs text-stone-500">{book.title} (Toplam: {totalCount})</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 font-bold px-2">✕</button>
                </div>

                {/* Content Table */}
                <div className="p-0 overflow-y-auto flex-1 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <span className="text-amber-800 font-bold">Yükleniyor...</span>
                        </div>
                    )}

                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 text-stone-500 uppercase text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3">Barkod</th>
                            <th className="px-6 py-3">Oda</th>
                            <th className="px-6 py-3">Raf</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                        {copies.map((copy) => {
                            const isEditing = editingId === copy.id;
                            return (
                                <tr key={copy.id} className="hover:bg-amber-50/20">

                                    {/* 1. Barkod (Sabit) */}
                                    <td className="px-6 py-4 font-mono text-stone-600 font-medium">
                                        {copy.barcodeNumber}
                                    </td>

                                    {/* 2. Oda (Düzenlenebilir) */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                className="border border-amber-300 rounded p-1 text-xs text-black w-full outline-none focus:ring-1 focus:ring-amber-500"
                                                value={editForm.roomId}
                                                onChange={(e) => setEditForm({ ...editForm, roomId: Number(e.target.value), shelfCode: '' })}
                                            >
                                                <option value={0}>Seçiniz</option>
                                                {rooms.map(r => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.roomCode} ({r.description})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-stone-800">
                                                {copy.shelf?.room?.roomCode} <span className="text-stone-400 text-[10px]">({copy.shelf?.room?.description})</span>
                                            </span>
                                        )}
                                    </td>

                                    {/* 3. Raf (Düzenlenebilir - Odaya Bağlı) */}
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                className="border border-amber-300 rounded p-1 text-xs text-black w-24 outline-none focus:ring-1 focus:ring-amber-500"
                                                value={editForm.shelfCode} // Value artık shelfCode (string)
                                                onChange={(e) => setEditForm({ ...editForm, shelfCode: e.target.value })}
                                                disabled={editForm.roomId === 0}
                                            >
                                                <option value="">Raf Seç</option>
                                                {availableShelves.map(s => (
                                                    // Value olarak shelfCode veriyoruz
                                                    <option key={s.id} value={s.shelfCode}>{s.shelfCode}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-xs">
                                                {copy.shelf?.shelfCode}
                                            </span>
                                        )}
                                    </td>

                                    {/* 4. Durum */}
                                    <td className="px-6 py-4">
                                        {copy.isAvailable
                                            ? <span className="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs border border-green-200 font-bold">Müsait</span>
                                            : <span className="text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs border border-red-200 font-bold">Ödünçte</span>
                                        }
                                    </td>

                                    {/* 5. İşlemler */}
                                    <td className="px-6 py-4 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSave(copy.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                                >
                                                    Kaydet
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1 rounded text-xs transition-colors"
                                                >
                                                    İptal
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(copy)}
                                                    className="text-amber-700 hover:text-amber-900 text-xs font-medium hover:underline"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(copy.id)}
                                                    className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {copies.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-stone-500">
                                    Bu kitaba ait kayıtlı kopya bulunamadı.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-stone-700 transition-colors"
                        >
                            ← Önceki
                        </button>
                        <span className="text-xs text-stone-600 font-medium bg-white px-3 py-1 border rounded shadow-sm">
                            Sayfa {page} / {totalPages || 1}
                        </span>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 bg-white border border-stone-300 rounded text-xs disabled:opacity-50 hover:bg-stone-100 text-stone-700 transition-colors"
                        >
                            Sonraki →
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-sm font-bold transition-colors"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}