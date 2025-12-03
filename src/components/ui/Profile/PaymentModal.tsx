'use client';
import React from 'react';
import { UserFineDto } from '@/src/types/user';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fine: UserFineDto | null;
    loading: boolean;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, fine, loading }: Props) {
    if (!isOpen || !fine) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border border-stone-200" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-xl text-amber-950 mb-2">Ödeme Onayı</h3>
                <p className="text-stone-600 text-sm mb-4">
                    Aşağıdaki cezayı ödemek ve borcu kapatmak üzeresiniz.
                </p>

                <div className="bg-stone-50 p-4 rounded border border-stone-100 mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-500">Ceza Tipi:</span>
                        <span className="font-bold text-stone-800">{fine.fineType}</span>
                    </div>
                    <div className="flex justify-between text-lg border-t border-stone-200 pt-2 mt-2">
                        <span className="text-stone-800 font-bold">Toplam Tutar:</span>
                        <span className="text-green-700 font-bold font-mono">{fine.amount} ₺</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded font-medium transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-6 py-2 text-sm bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow-sm disabled:opacity-70 transition-colors flex items-center gap-2"
                    >
                        {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                    </button>
                </div>
            </div>
        </div>
    );
}