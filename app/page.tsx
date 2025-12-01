'use client';

import {Suspense} from "react";
import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";
import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter(); // URL değiştirmek için
    const searchParams = useSearchParams();
    const paramsString = searchParams ? searchParams.toString() : "";

    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    //const [page, setPage] = useState(page);
    const [books, setBooks] = useState<Book[]>([]); // Tipini Book[] yap
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı state'i
    const [loading, setLoading] = useState(true);

    // Sayfa değiştirme fonksiyonu
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        console.log("Changing to page:", newPage);
        params.set("page", newPage.toString());

        // URL'i güncelle (bu useEffect'i tetikleyecek ve veriyi yeniden çekecek)
        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        const filter: BookFilterDto = {
            title: (searchParams?.get("title") as string) ?? undefined,
            categoryId: searchParams?.get("categoryId") ? parseInt(searchParams.get("categoryId") as string) : undefined,
            publicationYearFrom: searchParams?.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
            publicationYearTo: searchParams?.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,
            // ... diğer filtreler ...
            page: page,
            size: size
        };

        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const result = await bookService.getAllBooks(filter);

                if (!mounted) return;

                console.log("Fetched books:", result);
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
            <Suspense fallback={<div>Yükleniyor...</div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                <Suspense fallback={<div>Yükleniyor...</div>}>
                    <Sidebar />
                </Suspense>

                <section className="flex-1">
                    <ResultsInfo totalCount={totalCount} />

                    <BookGrid books={books} loading={loading} />

                    {!loading && (
                        <Pagination
                            page={page}
                            //setPage={setPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            </main>
        </div>
    );
}