'use client';

import { useEffect, useState, Suspense } from "react";
import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";
import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";
import { useSearchParams, useRouter } from "next/navigation";

function HomeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramsString = searchParams ? searchParams.toString() : "";

    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
        // Sayfa değişince mobilde filtreleri kapatıp yukarı kaydırabiliriz (isteğe bağlı)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const filter: BookFilterDto = {
            title: (searchParams?.get("title") as string) ?? undefined,
            categoryId: searchParams?.get("categoryId") ? parseInt(searchParams.get("categoryId") as string) : undefined,
            publicationYearFrom: searchParams?.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
            publicationYearTo: searchParams?.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,
            page: page,
            size: size
        };

        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const result = await bookService.getAllBooks(filter);
                if (!mounted) return;
                setBooks(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(result.totalPages || 0);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [paramsString, page]);

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
            <Suspense fallback={<div className="bg-white h-16 border-b border-stone-200"></div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-4 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8 transition-all">
                <div className="md:hidden mb-2">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-amber-200 text-amber-900 py-2 px-4 rounded-md font-serif font-bold shadow-sm hover:bg-amber-50 transition-colors"
                    >
                        <span>{showMobileFilters ? '✕ Filtreleri Gizle' : '▼ Filtrele ve Sırala'}</span>
                    </button>
                </div>

                <div className={`
                    ${showMobileFilters ? 'block' : 'hidden'} 
                    md:block 
                    w-full md:w-auto transition-all duration-300 ease-in-out
                `}>
                    <Suspense fallback={<div className="w-64 h-96 bg-stone-200 animate-pulse rounded-md"></div>}>
                        <Sidebar />
                    </Suspense>
                </div>

                <section className="flex-1 min-w-0">
                    <ResultsInfo totalCount={totalCount} />

                    <div className="mt-4">
                        <BookGrid books={books} loading={loading} />
                    </div>
                    {!loading && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="text-amber-900 font-serif animate-pulse">Yükleniyor...</div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}