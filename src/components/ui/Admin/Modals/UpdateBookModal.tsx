'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bookService } from '@/src/services/bookService';
import { authorService } from '@/src/services/authorService';
import { publisherService } from '@/src/services/publisherService';
import { categoryService } from '@/src/services/categoryService';
import { Book, UpdateBookDto } from '@/src/types/book';
import { Author, Publisher } from '@/src/types/publisherAndAuthor';
import { Category } from '@/src/types/category';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onSuccess: () => void;
}

export default function UpdateBookModal({ isOpen, onClose, book, onSuccess }: Props) {
    // 1. DÜZELTME: State'i başlangıçta book verisiyle dolduruyoruz (varsa)
    // Yoksa boş string veriyoruz ki inputlar "controlled" kalsın.
    const [form, setForm] = useState<Partial<UpdateBookDto>>({
        title: book?.title || '',
        isbn: book?.isbn || '',
        pageCount: book?.pageCount || 0,
        publicationYear: book?.publicationYear || 0,
        language: book?.language || '',
        authorId: book?.authorId || 0,
        publisherId: book?.publisherId || 0,
        categoryId: book?.categoryId || 0
    });

    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Dropdown verilerini çek (Sadece ilk açılışta)
    useEffect(() => {
        if (isOpen) {
            Promise.all([
                authorService.getAllAuthors(),
                publisherService.getAllPublishers(),
                categoryService.getCategories()
            ]).then(([a, p, c]) => {
                if(Array.isArray(a)) setAuthors(a);
                if(Array.isArray(p)) setPublishers(p);
                if(Array.isArray(c)) setCategories(c);
            });
        }
    }, [isOpen]);

    // Book değişirse formu güncelle (useEffect ile senkronizasyon yerine key kullanımı daha iyidir ama bu da çalışır)
    useEffect(() => {
        if (book) {
            setForm({
                id: book.id,
                title: book.title,
                isbn: book.isbn,
                pageCount: book.pageCount,
                publicationYear: book.publicationYear,
                language: book.language,
                authorId: book.authorId,
                publisherId: book.publisherId,
                categoryId: book.categoryId // Burada categoryId'nin book nesnesinde olduğundan emin ol
            });
        }
    }, [book]);

    if (!isOpen || !book) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Güncelleniyor...");

        try {
            const dto: UpdateBookDto = {
                id: book.id,
                title: form.title!,
                isbn: form.isbn!,
                pageCount: Number(form.pageCount),
                publicationYear: Number(form.publicationYear),
                language: form.language!,
                authorId: Number(form.authorId),
                publisherId: Number(form.publisherId),
                categoryId: Number(form.categoryId)
            };

            await bookService.updateBook(book.id, dto);

            toast.success("Kitap güncellendi!", { id: toastId });
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Güncelleme hatası", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Helper class
    const inputClass = "w-full border border-stone-300 p-2 rounded text-sm text-black focus:outline-none focus:border-amber-500 bg-white";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl border border-stone-200 p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-xl text-amber-950 mb-6 border-b border-stone-100 pb-2">Kitap Düzenle</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">Kitap Adı</label>
                            {/* DÜZELTME 2: value={form.title || ''} kullanarak undefined olmasını engelliyoruz */}
                            <input type="text" name="title" value={form.title || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">ISBN</label>
                            <input type="text" name="isbn" value={form.isbn || ''} onChange={handleChange} className={inputClass} />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">Yazar</label>
                            <select name="authorId" value={form.authorId || ''} onChange={handleChange} className={inputClass}>
                                <option value="">Seçiniz...</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">Kategori</label>
                            <select name="categoryId" value={form.categoryId || ''} onChange={handleChange} className={inputClass}>
                                <option value="">Seçiniz...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">Yayınevi</label>
                            <select name="publisherId" value={form.publisherId || ''} onChange={handleChange} className={inputClass}>
                                <option value="">Seçiniz...</option>
                                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Yıl</label>
                                <input type="number" name="publicationYear" value={form.publicationYear || ''} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-600 block mb-1">Sayfa</label>
                                <input type="number" name="pageCount" value={form.pageCount || ''} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-600 block mb-1">Dil</label>
                            <select name="language" value={form.language || ''} onChange={handleChange} className={inputClass}>
                                <option value="Türkçe">Türkçe</option>
                                <option value="İngilizce">İngilizce</option>
                                <option value="Almanca">Almanca</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded text-sm">İptal</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-900 text-white rounded text-sm hover:bg-amber-800">
                            {loading ? '...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}