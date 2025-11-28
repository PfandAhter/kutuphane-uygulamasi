import React from 'react';

// Yardımcı fonksiyonları buraya aldık, çünkü sadece kart kullanıyor.
const getBookImage = (title: string) => {
    return `https://placehold.co/150x220/e8e0d5/5d4037?text=${encodeURIComponent(title.substring(0, 20))}`;
};

const getAuthorNames = (book: any) => {
    if (book.bookAuthors && book.bookAuthors.length > 0) {
        return book.bookAuthors.map((item: any) =>
            item.author ? `${item.author.firstName} ${item.author.lastName}` : "Yazar Bilgisi Yok"
        ).join(", ");
    }
    if (book.authorFirstName) return `${book.authorFirstName} ${book.authorLastName}`;
    return "Bilinmeyen Yazar";
};

interface BookCardProps {
    book: any; // Type sorunu yaşamaman için şimdilik any
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <a href={`/book/${book.id}`} className="block group h-full">
            <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 cursor-pointer flex flex-col h-full">

                {/* Kitap Resmi */}
                <div className="h-56 w-full bg-stone-200 mb-4 rounded-md overflow-hidden relative shadow-inner">
                    <img
                        src={getBookImage(book.title)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 sepia-[.3]"
                    />
                    <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300"></div>

                    {/* Kategori Badge'i */}
                    {book.category && (
                        <div className="absolute top-2 right-2 bg-amber-900/90 text-white text-[10px] px-2 py-1 rounded shadow">
                            {book.category.name}
                        </div>
                    )}
                </div>

                {/* Kitap Bilgileri */}
                <div className="flex-1">
                    <h3 className="font-serif font-bold text-amber-950 text-xl truncate mb-1 group-hover:text-amber-700 transition-colors" title={book.title}>
                        {book.title}
                    </h3>

                    <p className="text-sm text-stone-500 italic mb-3 font-serif border-b border-stone-100 pb-2">
                        {getAuthorNames(book)}
                    </p>

                    {book.publisher && (
                        <p className="text-xs text-stone-400 mb-2 truncate">
                            {book.publisher.name}
                        </p>
                    )}
                </div>

                {/* Fiyat/Sayfa ve Buton */}
                <div className="flex justify-between items-center mt-auto pt-2">
                    <span className="font-bold text-amber-900 text-lg">{book.pageCount} Sayfa</span>
                    <button className="text-xs bg-amber-900 text-amber-50 px-4 py-2 rounded shadow hover:bg-amber-800 transition-colors font-serif tracking-wide">
                        İncele
                    </button>
                </div>
            </div>
        </a>
    );
}