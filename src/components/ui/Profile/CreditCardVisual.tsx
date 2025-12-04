'use client';

import React from 'react';

interface CreditCardVisualProps {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvc: string;
    focusedField: string | null;
}

export default function CreditCardVisual({ cardNumber, cardName, expiry, cvc, focusedField }: CreditCardVisualProps) {
    const formatCardNumberPlaceholder = (num: string) => {
        const standard = '#### #### #### ####';
        if (!num) return standard;
        let formatted = '';
        for (let i = 0; i < num.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += num[i];
        }
        return formatted + standard.slice(formatted.length);
    };

    const isFlipped = focusedField === 'cvc';

    return (
        <div className="w-full max-w-[360px] h-[220px] mx-auto mb-6 perspective-[1000px] select-none">
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl shadow-xl p-6 text-white backface-hidden flex flex-col justify-between border border-stone-700 z-10">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md border border-yellow-600 opacity-80 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-[1px] bg-yellow-700 absolute top-1/3"></div>
                            <div className="w-full h-[1px] bg-yellow-700 absolute bottom-1/3"></div>
                            <div className="h-full w-[1px] bg-yellow-700 absolute left-1/3"></div>
                            <div className="h-full w-[1px] bg-yellow-700 absolute right-1/3"></div>
                        </div>
                        <span className="font-serif italic text-lg opacity-70">KütüphaneKart</span>
                    </div>

                    <div className="space-y-6">
                        <div className={`font-mono text-xl tracking-widest transition-all p-1 -m-1 rounded ${focusedField === 'number' ? 'border border-amber-500/50 bg-amber-500/10' : ''}`}>
                            {formatCardNumberPlaceholder(cardNumber)}
                        </div>

                        <div className="flex justify-between items-end">
                            <div className={`flex flex-col p-1 -m-1 rounded transition-all ${focusedField === 'name' ? 'border border-amber-500/50 bg-amber-500/10' : ''}`}>
                                <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">Kart Sahibi</span>
                                <span className="font-medium uppercase tracking-wide text-sm truncate max-w-[180px]">
                                    {cardName || 'AD SOYAD'}
                                </span>
                            </div>
                            <div className={`flex flex-col p-1 -m-1 rounded transition-all ${focusedField === 'expiry' ? 'border border-amber-500/50 bg-amber-500/10' : ''}`}>
                                <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider">SKT</span>
                                <span className="font-mono font-medium tracking-wider text-sm">
                                    {expiry || 'MM/YY'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl shadow-xl rotate-y-180 backface-hidden overflow-hidden border border-stone-700">
                    <div className="w-full h-12 bg-black mt-6 opacity-80"></div>
                    <div className="p-6 mt-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider mr-1">CVV</span>
                            <div className={`w-full bg-white text-stone-900 font-mono text-right p-2 rounded font-bold flex justify-end items-center h-10 ${focusedField === 'cvc' ? 'border-2 border-amber-500' : ''}`}>
                                <span className="tracking-widest text-lg">{cvc || '***'}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center opacity-50">
                            <span className="text-3xl">🏦</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}