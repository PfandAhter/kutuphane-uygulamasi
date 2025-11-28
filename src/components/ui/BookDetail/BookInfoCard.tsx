import React from 'react';
import {BookDetail} from "@/src/types/bookDetail";

interface Props {
    book: BookDetail;
}


const BookInfoCard = ({ book }: Props) => {
    // Yazarları string olarak birleştirelim
    const authorNames = book.bookAuthors?.map(ba => `${ba.author.firstName} ${ba.author.lastName}`).join(", ") || "Yazar Bilgisi Yok";

    return (
        <div className="bg-white border border-amber-200 rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-8">
            {/* Sol Taraf: Kapak Resmi (Placeholder) */}
            <div className="w-full md:w-48 shrink-0">
                <div className="aspect-[2/3] w-full bg-stone-200 rounded-md border border-stone-300 flex items-center justify-center text-stone-400 overflow-hidden">
                    {/* Temporary random image */}
                    <img
                        src={`https://picsum.photos/300/450?random=${encodeURIComponent(book.title)}`}
                        alt={book.title || "Book cover"}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Sağ Taraf: Başlık ve Özet */}
            <div className="flex-1">
                <div className="mb-4">
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                        {book.category?.name || "Kategori Yok"}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-950 mb-2">
                    {book.title}
                </h1>

                <p className="text-lg text-stone-600 font-medium mb-6">
                    {authorNames}
                </p>

                <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                    <h3 className="font-serif font-bold text-lg text-amber-900 mb-2 border-b border-amber-100 pb-1">Özet</h3>
                    <p>
                        {book.description || "Bu kitap için henüz bir özet girilmemiştir. Kitap detayları aşağıda yer almaktadır."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookInfoCard;