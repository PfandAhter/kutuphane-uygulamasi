'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AddBookCopyModal from '@/src/components/ui/Admin/Modals/AddBookCopyModal';
import { bookService } from '@/src/services/bookService';
// DÜZELTME: Güncellediğin Book interface'ini kullanıyoruz
import { Book, BookFilterDto } from '@/src/types/book';
import ManageBookCopiesModal from "@/src/components/ui/Admin/Modals/ManageBookCopiesModal";

export default function AdminBooksPage() {
    // --- STATE YÖNETİMİ ---
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Filtreler
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Modal Durumu
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // --- VERİ ÇEKME FONKSİYONU ---
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const filterDto: BookFilterDto = {
                title: searchTerm || undefined,
                categoryId: selectedCategory,
                page: page,
                size: pageSize
            };

            const result = await bookService.getAllBooks(filterDto);

            setBooks(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            console.error("Kitaplar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // --- HANDLERS ---

    const handleSearch = () => {
        setPage(1);
        fetchBooks();
    };

    const handleOpenCopyModal = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleOpenManageModal = (book: Book) => {
        setSelectedBook(book);
        setIsManageModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsManageModalOpen(false);
        setSelectedBook(null);
    };

    const handleUpdateSuccess = () => {
        fetchBooks();
    };

    // --- RENDER ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 font-serif">Kitap Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Toplam {totalCount} kitap listeleniyor.</p>
                </div>
                <Link
                    href="/admin/books/add"
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span>➕</span> Yeni Kitap Ekle
                </Link>
            </div>

            {/* Filtreleme Alanı */}
            <div className="bg-white p-4 rounded-lg border border-stone-200 flex gap-4 shadow-sm">
                <input
                    type="text"
                    placeholder="Kitap Adı Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400"
                />

                <select
                    value={selectedCategory ?? ""}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-600 bg-white"
                >
                    <option value="">Tüm Kategoriler</option>
                    <option value="1">Edebiyat</option>
                    <option value="2">Tarih</option>
                    <option value="3">Bilim</option>
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-2 rounded text-sm font-medium transition-colors"
                >
                    Ara
                </button>
            </div>

            {/* Kitap Tablosu */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Kitap Adı</th>
                        <th className="px-6 py-3">Yazar(lar)</th>
                        <th className="px-6 py-3">Kategori</th>
                        <th className="px-6 py-3">Yayın Yılı</th>
                        {/* YENİ EKLENEN KOLON BAŞLIĞI */}
                        <th className="px-6 py-3 text-center">Kopya (Stok)</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">

                    {loading && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-stone-500"> {/* colSpan arttırıldı */}
                                <span className="inline-block animate-spin text-amber-600 mr-2">↻</span>
                                Kitaplar yükleniyor...
                            </td>
                        </tr>
                    )}

                    {!loading && books.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-stone-500 italic"> {/* colSpan arttırıldı */}
                                Aradığınız kriterlere uygun kitap bulunamadı.
                            </td>
                        </tr>
                    )}

                    {!loading && books.map((book) => {
                        // Kopya sayısını hesapla (dizi yoksa 0)
                        const copyCount = book.bookCopies?.length || 0;

                        return (
                            <tr key={book.id} className="hover:bg-amber-50/30 transition-colors group">
                                <td className="px-6 py-4 font-mono text-stone-400">#{book.id}</td>

                                <td className="px-6 py-4 font-bold text-stone-800">
                                    {book.title}
                                    <div className="text-[10px] text-stone-400 font-normal">{book.isbn}</div>
                                </td>

                                <td className="px-6 py-4 text-stone-600">
                                    {book.bookAuthors && book.bookAuthors.length > 0 ? (
                                        book.bookAuthors.map(ba => `${ba.author.firstName} ${ba.author.lastName}`).join(", ")
                                    ) : (
                                        // Eğer bookAuthors boşsa fallback olarak düz author alanlarını kullan
                                        (book.authorFirstName && book.authorLastName)
                                            ? `${book.authorFirstName} ${book.authorLastName}`
                                            : <span className="text-stone-400 italic">Bilinmiyor</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs">
                                        {/* Kategori nesnesi yoksa categoryName stringini kullan */}
                                        {book.category?.name || book.categoryName || "Genel"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-stone-600">
                                    {book.publicationYear}
                                </td>

                                {/* YENİ EKLENEN KOPYA SAYISI KOLONU */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        copyCount > 0
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {copyCount} Adet
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenCopyModal(book)}
                                        className="bg-stone-100 hover:bg-amber-100 text-amber-800 border border-stone-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                        title="Hızlı Kopya Ekle"
                                    >
                                        <span>📥</span> Kopya Ekle
                                    </button>

                                    <button
                                        onClick={() => handleOpenManageModal(book)}
                                        className="bg-stone-100 hover:bg-amber-100 text-amber-800 border border-stone-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                        title="Kopyaları Düzenle/Sil"
                                    >
                                        <span>📋</span> Kopya Yönet
                                    </button>

                                    <div className="h-4 w-px bg-stone-300 mx-1"></div>
                                    <button
                                        className="text-stone-400 hover:text-amber-700 transition-colors font-medium"
                                        onClick={() => alert('Düzenleme işlemi henüz uygulanmadı.')}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        className="text-stone-400 hover:text-red-700 transition-colors font-medium"
                                        onClick={() => alert('Silme işlemi henüz uygulanmadı.')}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && totalCount > 0 && (
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-stone-500">
                        Toplam {Math.ceil(totalCount / pageSize)} sayfa ({totalCount} kayıt)
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border text-black rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            ← Önceki
                        </button>
                        <span className="px-3 py-1 bg-stone-100 rounded text-xs font-bold text-stone-700">
                            {page}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={books.length < pageSize}
                            className="px-3 py-1 border text-black rounded text-xs disabled:opacity-50 hover:bg-stone-100"
                        >
                            Sonraki →
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL COMPONENT */}
            <AddBookCopyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                book={selectedBook}
            />
            <ManageBookCopiesModal
                isOpen={isManageModalOpen}
                onClose={handleCloseModal}
                book={selectedBook}
                onUpdate={handleUpdateSuccess}
            />
        </div>
    );
}