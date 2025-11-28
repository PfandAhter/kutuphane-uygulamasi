import React from 'react';
import BookCard from './BookCard';

interface BookGridProps {
    books: any[];
    loading: boolean;
}

export default function BookGrid({ books, loading }: BookGridProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 animate-pulse">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin mb-4"></div>
                <p>Kütüphane taranıyor...</p>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg border border-stone-100 shadow-sm">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-serif text-amber-900 font-semibold">Sonuç Bulunamadı</h3>
                <p className="text-stone-500">Aradığınız kriterlere uygun kitap mevcut değil.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}