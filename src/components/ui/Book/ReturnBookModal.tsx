'use client';
import React, { useState, useEffect } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReturnBookModal({ isOpen, onClose }: Props) {
    const [barcode, setBarcode] = useState('');

    useEffect(() => {
        if (isOpen) setBarcode('');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`İade işlemi simülasyonu: Barkod ${barcode}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 border border-stone-200" onClick={e => e.stopPropagation()}>

                <div className="mb-6 border-b border-stone-100 pb-2">
                    <h3 className="font-serif font-bold text-xl text-green-900 flex items-center gap-2">
                        <span>↩️</span> İade Al
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">Kitabı teslim almak için barkodu okutunuz.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-600 mb-1">Barkod Numarası</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            value={barcode}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value)) setBarcode(e.target.value);
                            }}
                            placeholder="Barkod giriniz..."
                            className="w-full border border-stone-300 text-stone-800 rounded p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all font-mono"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm bg-green-700 text-white rounded font-bold hover:bg-green-800 shadow-sm transition-colors"
                        >
                            İadeyi Onayla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}