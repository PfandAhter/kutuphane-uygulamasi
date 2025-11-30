'use client';

import React, { useState } from 'react';
import { BookComment } from '@/src/types/book';

// Mock Data (Backend bağlanana kadar)
const MOCK_COMMENTS: BookComment[] = [
    { id: 1, userName: "Ahmet Yılmaz", content: "Muazzam bir eser, kesinlikle okunmalı. Tarihi detaylar çok iyi işlenmiş.", rating: 5, createdAt: "2024-11-20" },
    { id: 2, userName: "Ayşe Demir", content: "Biraz ağır ilerliyor ama sonu tatmin edici.", rating: 4, createdAt: "2024-11-18" },
];

const BookReviews = ({ bookId }: { bookId: number }) => {
    const [comments, setComments] = useState<BookComment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Burada backend'e post isteği atılacak
        const commentObj: BookComment = {
            id: Date.now(),
            userName: "Siz", // Giriş yapmış kullanıcı adı gelecek
            content: newComment,
            rating: rating,
            createdAt: new Date().toISOString().split('T')[0]
        };

        setComments([commentObj, ...comments]);
        setNewComment("");
        setRating(5);
        alert("Yorumunuz başarıyla eklendi!");
    };

    // Yıldız render etme yardımcısı
    const renderStars = (count: number) => {
        return (
            <div className="flex text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < count ? "★" : "☆"}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm mt-8">
            <h3 className="font-serif font-bold text-xl text-amber-950 mb-6 border-b border-amber-100 pb-2">
                Okuyucu Yorumları ({comments.length})
            </h3>

            {/* Yorum Listesi */}
            <div className="space-y-6 mb-8">
                {comments.length === 0 && <p className="text-stone-500 italic">Henüz yorum yapılmamış.</p>}

                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        {/* Avatar Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold shrink-0">
                            {comment.userName.charAt(0)}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-stone-800 text-sm">{comment.userName}</h4>
                                <span className="text-xs text-stone-400">{comment.createdAt}</span>
                            </div>
                            {renderStars(comment.rating)}
                            <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Yorum Yapma Formu */}
            <div className="bg-stone-50 p-4 rounded-md border border-stone-200">
                <h4 className="font-serif font-bold text-amber-900 mb-3 text-sm">Yorum Yap</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-xs font-bold text-stone-600 mb-1">Puanınız</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-colors ${rating >= star ? 'text-amber-500' : 'text-stone-300 hover:text-amber-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Kitap hakkında düşünceleriniz..."
                            className="w-full p-3 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 min-h-[80px]"
                            required
                        />
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-amber-900 hover:bg-amber-800 text-amber-50 px-6 py-2 rounded text-sm font-serif transition-colors shadow-sm"
                        >
                            Gönder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookReviews;