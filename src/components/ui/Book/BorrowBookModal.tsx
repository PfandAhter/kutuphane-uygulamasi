'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '@/src/services/loanService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    barcode: string;
    bookTitle: string;
    onSuccess: () => void;
}

export default function BorrowBookModal({ isOpen, onClose, barcode, bookTitle, onSuccess }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const defaultEnd = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [inputBarcode, setInputBarcode] = useState(barcode);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInputBarcode(barcode);
            setStartDate(today);
            setEndDate(defaultEnd);
        }
    }, [isOpen, barcode, today, defaultEnd]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputBarcode.trim()) {
            return toast.error("Lütfen barkod numarasını giriniz.");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Tarih kontrolü (Bitiş, başlangıçtan küçük veya eşit olamaz)
        if (end <= start) {
            return toast.error("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
        }

        // --- GÜN SAYISI HESAPLAMA ---
        // Milisaniye farkını alıp güne çeviriyoruz
        const diffInMs = end.getTime() - start.getTime();
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        setLoading(true);
        const toastId = toast.loading("Ödünç verme işlemi yapılıyor...");

        try {
            await loanService.createLoan({
                barcodeNumber: inputBarcode.trim(),
                loanDays: diffInDays
            });

            toast.success("Kitap başarıyla ödünç verildi!", { id: toastId });
            onSuccess();
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message || "İşlem başarısız.";
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border border-stone-200" onClick={e => e.stopPropagation()}>

                <div className="mb-6 border-b border-stone-100 pb-2">
                    <h3 className="font-serif font-bold text-xl text-amber-950">Ödünç Ver</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">{bookTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Barkod Giriş Alanı */}
                    <div>
                        <label className="block text-xs font-bold text-black mb-1">Barkod Numarası</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            value={inputBarcode}
                            onChange={(e) => setInputBarcode(e.target.value)}
                            placeholder="Kitap barkodunu giriniz..."
                            className="w-full border text-black rounded p-2.5 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono"
                        />
                    </div>

                    {/* Başlangıç Tarihi */}
                    <div>
                        <label className="block text-xs font-bold text-black mb-1">Başlangıç Tarihi</label>
                        <input
                            type="date"
                            required
                            min={today} // Bugünden öncesi seçilemez
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border text-black rounded p-2 text-sm focus:border-amber-500 outline-none"
                        />
                    </div>

                    {/* Bitiş Tarihi */}
                    <div>
                        <label className="block text-xs font-bold text-black mb-1">Bitiş Tarihi (Tahmini İade)</label>
                        <input
                            type="date"
                            required
                            min={startDate} // Başlangıç tarihinden öncesi seçilemez
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border text-black rounded p-2 text-sm focus:border-amber-500 outline-none"
                        />
                    </div>

                    {/* Bilgilendirme: Kaç gün seçildiğini göster */}
                    {startDate && endDate && new Date(endDate) > new Date(startDate) && (
                        <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 text-center">
                            Süre: <strong>{Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}</strong> Gün
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-black hover:bg-stone-100 rounded font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm bg-amber-900 text-white rounded font-bold hover:bg-amber-800 shadow-sm disabled:opacity-70 transition-colors"
                        >
                            {loading ? 'İşleniyor...' : 'Onayla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}