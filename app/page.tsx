'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

// Layout & UI Components
import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";

// New Refactored Components
import AuthenticatedBanner from "@/src/components/ui/Home/AuthenticatedBanner";
import GuestBanner from "@/src/components/ui/Home/GuestBanner";
import MobileFilterButton from "@/src/components/ui/Home/MobileFilterButton";

// Services & Types
import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";

function HomeContent() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const searchParams = useSearchParams();

    // --- State Management ---
    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // --- Handlers ---
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Data Fetching ---
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

        return () => { mounted = false; };
    }, [searchParams, page]);

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans">
            <Suspense fallback={<div className="bg-amber-950 h-20"></div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">

                {/* 1. Mobile Filter Toggle */}
                <MobileFilterButton
                    isOpen={showMobileFilters}
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                />

                {/* 2. Sidebar (Filters) */}
                <aside className={`
                    lg:block lg:w-72 shrink-0 transition-all duration-300 ease-in-out z-20
                    ${showMobileFilters ? 'block' : 'hidden'}
                `}>
                    <div className="sticky top-24">
                        <Suspense fallback={<div className="w-full h-96 bg-stone-200 animate-pulse rounded-xl"></div>}>
                            <Sidebar />
                        </Suspense>
                    </div>
                </aside>

                {/* 3. Main Content Area */}
                <section className="flex-1 min-w-0">

                    {/* Dynamic Banner */}
                    {isAuthenticated && user ? (
                        <AuthenticatedBanner
                            user={user}
                            totalBookCount={totalCount}
                            onProfileClick={() => router.push('/profile')}
                        />
                    ) : (
                        <GuestBanner />
                    )}

                    {/* Results & Grid */}
                    <div className="flex flex-col gap-4">
                        <ResultsInfo totalCount={totalCount} />
                        <BookGrid books={books} loading={loading} />
                    </div>

                    {/* Pagination */}
                    {!loading && totalCount > 0 && (
                        <div className="mt-10 flex justify-center pb-8">
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

// --- Main Page Component ---
export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
                    <span className="text-amber-900 font-serif font-medium animate-pulse">Kütüphane Yükleniyor...</span>
                </div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}