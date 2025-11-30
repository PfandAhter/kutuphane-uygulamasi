"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {categoryService} from "@/src/services/categoryService";
import {Category} from "@/src/types/category";
import CategoryListSkeleton from "@/src/components/ui/Skeletons/CategoryListSkeleton";

const Sidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [author, setAuthor] = useState(searchParams.get('author') || '');
    const [yearMin, setYearMin] = useState(searchParams.get('yearMin') || '');
    const [yearMax, setYearMax] = useState(searchParams.get('yearMax') || '');

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await categoryService.getCategories();

                if(!result || result.length === 0) {
                    setCategories([]);
                    setIsLoading(false);
                    return;
                }
                setCategories(result);
            } catch (error) {
                console.error("Kategori verisi alınırken hata oluştu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId?: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            params.set('categoryId', categoryId.toString());
        } else {
            params.delete('categoryId');
        }
        router.push(`/?${params.toString()}`);
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (author) params.set('author', author);
        else params.delete('author');

        if (yearMin) params.set('yearMin', yearMin);
        else params.delete('yearMin');

        if (yearMax) params.set('yearMax', yearMax);
        else params.delete('yearMax');

        router.push(`/?${params.toString()}`);
    };

    return (
        <aside className="w-full md:w-64 bg-stone-50 border border-amber-200/80 rounded-md p-5 h-fit sticky top-4 shadow-sm">

            <h3 className="font-serif font-bold text-lg mb-4 text-amber-950 border-b border-amber-200 pb-2">
                Kategoriler
            </h3>

            <ul className="space-y-2 text-sm text-stone-700">
                {/* Tüm Kitaplar Seçeneği (Sabit Kalır) */}
                <li
                    onClick={() => handleCategoryClick()}
                    className={`cursor-pointer hover:text-amber-800 hover:translate-x-1 transition-all font-bold ${!searchParams.get('categoryId') ? 'text-amber-900' : ''}`}>
                    Tüm Kitaplar
                </li>

                {/* Yükleniyor Durumu */}
                {isLoading && (
                    <CategoryListSkeleton/>
                )}

                {/* Dinamik Kategoriler */}
                {!isLoading && categories.map((category) => (
                    <li
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`cursor-pointer hover:text-amber-800 hover:translate-x-1 transition-all flex justify-between group ${
                            searchParams.get('categoryId') === category.id.toString()
                                ? 'text-amber-900 font-bold'
                                : ''
                        }`}
                    >
                        <span>{category.name}</span>
                        {/* Eğer backend count verisi dönerse göster, dönmezse gizle */}
                        {category.bookCount !== undefined && (
                            <span className="text-amber-600/60 text-xs group-hover:text-amber-800">
                                ({category.bookCount})
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                <h3 className="font-serif font-bold text-md mb-3 text-amber-950 border-b border-amber-200 pb-2">
                    Filtrele
                </h3>

                <div className="mb-4">
                    <p className="font-serif font-medium text-stone-800 text-sm mb-2">Yazar</p>
                    <input
                        type="text"
                        placeholder="Yazar ara..."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full border border-amber-300 bg-white p-2 text-sm rounded text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                    />
                </div>

                <div className="mb-4">
                    <p className="font-serif font-medium text-stone-800 text-sm mb-2">Yayın Yılı</p>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={yearMin}
                            onChange={(e) => setYearMin(e.target.value)}
                            className="w-1/2 border border-amber-300 bg-white p-2 text-sm rounded text-stone-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={yearMax}
                            onChange={(e) => setYearMax(e.target.value)}
                            className="w-1/2 border border-amber-300 bg-white p-2 text-sm rounded text-stone-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleApplyFilters}
                    className="w-full bg-amber-900 text-amber-50 font-serif py-2 rounded text-sm hover:bg-amber-800 transition shadow-md">
                    Filtreleri Uygula
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;