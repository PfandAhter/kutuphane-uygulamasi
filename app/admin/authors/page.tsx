'use client';

import React, {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import { authorService } from '@/src/services/authorService';
import {Author, CreateAuthorDto} from '@/src/types/publisherAndAuthor';
import PaginationControls from '@/src/components/ui/Admin/Common/PaginationControls';
import GenericDeleteModal from "@/src/components/ui/Admin/Modals/GenericDeleteModal";
import {publisherService} from "@/src/services/publisherService";

export default function AdminAuthorsPage() {
    // --- STATE ---
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination & Filter
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [firstNameFilter, setFirstNameFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [newAuthor, setNewAuthor] = useState<CreateAuthorDto>({firstName: '', lastName: ''});
    const [submitting, setSubmitting] = useState(false);

    // --- FETCH DATA ---
    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const result = await authorService.getAllAuthorPageable(page, pageSize);
            if (result && Array.isArray(result.items)) {
                setAuthors(result.items);
                setTotalCount(result.totalCount || 0);
            } else {
                setAuthors([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Yazarlar yüklenemedi", error);
            toast.error("Yazar listesi yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const searchAuthors = async () => {
        setLoading(true);
        try {
            // Backend'de 'getAuthorByNameAndLastName' endpoint'i sayfalama desteklemediği için
            // dönen tüm listeyi gösteriyoruz.
            const result = await authorService.getAuthorByNameAndLastName(firstNameFilter, lastNameFilter);
            console.log("Arama sonuçları:", result);

            if (Array.isArray(result)) {
                setAuthors(result);
                setTotalCount(result.length); // Toplam kayıt sayısı bulunan kadar olur
                setIsSearching(true); // Arama modu aktif (Pagination gizlenebilir)
            } else {
                setAuthors([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Arama hatası", error);
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (firstNameFilter.trim() === "" && lastNameFilter.trim() === "") {
            fetchAuthors();
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            searchAuthors();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [firstNameFilter, lastNameFilter]);

    const handleClearFilters = () => {
        setFirstNameFilter("");
        setLastNameFilter("");
    };

    useEffect(() => {
        if (firstNameFilter.trim() === "" && lastNameFilter.trim() === "") {
            fetchAuthors();
        }
    }, [page]);

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAuthor.firstName || !newAuthor.lastName) {
            toast.error("Ad ve Soyad zorunludur.");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Yazar ekleniyor...");

        try {
            await authorService.createAuthor(newAuthor);
            toast.success("Yazar başarıyla eklendi!", {id: toastId});

            setNewAuthor({firstName: '', lastName: ''});
            setIsAddModalOpen(false);
            fetchAuthors(); // Listeyi yenile
        } catch (error) {
            toast.error("Ekleme başarısız.", {id: toastId});
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`${name} isimli yazarı silmek istediğinize emin misiniz?`)) return;

        const toastId = toast.loading("Siliniyor...");
        try {
            await authorService.deleteAuthor(id);
            toast.success("Yazar silindi.", {id: toastId});
            fetchAuthors(); // Listeyi yenile
        } catch (error) {
            toast.error("Silme başarısız.", {id: toastId});
        }
    };

    const handleSuccess = () => {
        if (firstNameFilter || lastNameFilter) searchAuthors();
        else fetchAuthors();
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800 font-serif">Yazar Yönetimi</h1>
                    <p className="text-stone-500 text-sm">Toplam {totalCount} yazar listeleniyor.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <span>➕</span> Yeni Yazar Ekle
                </button>
            </div>

            {/* Arama */}
            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Ad ile ara..."
                        value={firstNameFilter}
                        onChange={(e) => setFirstNameFilter(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400 transition-all"
                    />
                </div>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Soyad ile ara..."
                        value={lastNameFilter}
                        onChange={(e) => setLastNameFilter(e.target.value)}
                        className="w-full border border-stone-300 rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-stone-800 placeholder-stone-400 transition-all"
                    />
                </div>
                <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded border border-stone-200 hover:border-stone-300 transition-all"
                >
                    Temizle
                </button>
            </div>

            {/* Tablo */}
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-xs border-b border-stone-200">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Ad</th>
                        <th className="px-6 py-3">Soyad</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                    {loading && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-stone-500">Yükleniyor...</td>
                        </tr>
                    )}

                    {!loading && authors.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-stone-500 italic">Kayıt bulunamadı.</td>
                        </tr>
                    )}

                    {!loading && authors.map((author) => (
                        <tr key={author.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-stone-400">#{author.id}</td>
                            <td className="px-6 py-4 font-bold text-stone-800">{author.firstName}</td>
                            <td className="px-6 py-4 text-stone-800">{author.lastName}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button
                                    className="text-stone-400 hover:text-amber-700 transition-colors font-medium">Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(author.id, `${author.firstName} ${author.lastName}`)}
                                    className="text-stone-400 hover:text-red-700 transition-colors font-medium"
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!loading && !isSearching && totalCount > 0 && (
                <PaginationControls
                    currentPage={page}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    onPageChange={setPage}
                />
            )}

            {/* EKLEME MODALI (Aynı kalıyor) */}
            {isAddModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
                         onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-4 text-amber-950">Yeni Yazar Ekle</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Ad</label>
                                <input type="text" required value={newAuthor.firstName}
                                       onChange={e => setNewAuthor({...newAuthor, firstName: e.target.value})}
                                       className="w-full border p-2 rounded text-sm focus:border-amber-500 outline-none"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-600 mb-1">Soyad</label>
                                <input type="text" required value={newAuthor.lastName}
                                       onChange={e => setNewAuthor({...newAuthor, lastName: e.target.value})}
                                       className="w-full border p-2 rounded text-sm focus:border-amber-500 outline-none"/>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded">İptal
                                </button>
                                <button type="submit" disabled={submitting}
                                        className="px-4 py-2 text-sm bg-amber-900 text-white rounded hover:bg-amber-800 disabled:opacity-50">{submitting ? '...' : 'Ekle'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <GenericDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                entityId={selectedAuthor?.id || 0}
                entityName={`${selectedAuthor?.firstName} ${selectedAuthor?.lastName}`}
                entityType="Yazar"
                onDeleteService={authorService.deleteAuthor}
                onSuccess={fetchAuthors}
            />
        </div>
    );
}