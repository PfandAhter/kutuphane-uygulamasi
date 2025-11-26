import React from 'react';

interface ResultsInfoProps {
    totalCount: number;
}

export default function ResultsInfo({ totalCount }: ResultsInfoProps) {
    return (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-6 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
            <h2 className="font-serif font-semibold text-amber-900 text-lg">
                Arama Sonuçları: <span className="text-amber-700 font-bold ml-1">{totalCount} Eser bulundu</span>
            </h2>

            <select className="border border-amber-300 bg-white text-amber-900 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-600 cursor-pointer">
                <option>Akıllı Sıralama</option>
                <option>Fiyata Göre (Artan)</option>
                <option>Fiyata Göre (Azalan)</option>
            </select>
        </div>
    );
}