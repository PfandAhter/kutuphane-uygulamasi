'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";

import AuthenticatedBanner from "@/src/components/ui/Home/AuthenticatedBanner";
import GuestBanner from "@/src/components/ui/Home/GuestBanner";
import MobileFilterButton from "@/src/components/ui/Home/MobileFilterButton";
import QuickActionButtons from "@/src/components/ui/Home/QuickActionButtons";
import BorrowBookModal from "@/src/components/ui/Book/BorrowBookModal";
import ReturnBookModal from "@/src/components/ui/Book/ReturnBookModal";

import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";

//https://www.yarininumutlari.com/wp-content/uploads/2018/09/Atat%C3%BCrk0.jpg
//https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSceuqfKEPvTl7RgSlYUME8Qi5hXCUIxgTw9g&s
// Alternatif link: https://upload.wikimedia.org/wikipedia/commons/e/ea/Mustafa_Kemal_Atat%C3%BCrk_signature.svg (İmza istersen)
const BACKGROUND_IMAGE = "https://www.yarininumutlari.com/wp-content/uploads/2018/09/Atat%C3%BCrk0.jpg";

const MARTYR_INFO = {
    title: "ŞEHİDİN VAR TÜRKİYE",
    message: "İstanbul'da Narkotik operasyonunda 32 SUÇ KAYDI OLAN BİR OROSPU ÇOCUĞU ile çatışan Kahraman TÜRK Özel Harekat Polisimiz EMRE ALBAYRAK Şehit düşmüştür.",
    detail: "Vatan size minnettardır. Ruhunuz şad olsun.",
    date: new Date().toLocaleDateString('tr-TR'),
    images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoubS0_ejgVi9GUqJ-Z1WhrqJsX6oiDxMTmw&s", // Örnek: Türk Bayrağı
        "data:image/jpeg;base64,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"  // Örnek: Şehit Fotoğrafı veya Bayrak
    ]
};

function HomeContent() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const searchParams = useSearchParams();

    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const [isMartyrModalOpen, setIsMartyrModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeen = localStorage.getItem('hasSeenMartyrModal');
            if (!hasSeen) {
                const timer = setTimeout(() => {
                    setIsMartyrModalOpen(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleCloseMartyrModal = () => {
        setIsMartyrModalOpen(false);
        localStorage.setItem('hasSeenMartyrModal', 'true');
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const filter: BookFilterDto = {
            page: page,
            size: size,
            title: (searchParams?.get("title") as string) || undefined,

            categoryId: searchParams?.get("categoryId") ? parseInt(searchParams.get("categoryId") as string) : undefined,
            authorId: searchParams?.get("authorId") ? parseInt(searchParams.get("authorId") as string) : undefined,
            publisherId: searchParams?.get("publisherId") ? parseInt(searchParams.get("publisherId") as string) : undefined,

            publicationYearFrom: searchParams?.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
            publicationYearTo: searchParams?.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,

            pageCountMin: searchParams?.get("pageCountMin") ? parseInt(searchParams.get("pageCountMin") as string) : undefined,
            pageCountMax: searchParams?.get("pageCountMax") ? parseInt(searchParams.get("pageCountMax") as string) : undefined,

            language: (searchParams?.get("language") as string) || undefined,
            hasAvailableCopy: searchParams?.get("hasAvailableCopy") === 'true' ? true : undefined,
            roomCode: (searchParams?.get("roomCode") as string) || undefined
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
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans relative isolate">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
                <div
                    className="w-[1000px] h-[1000px] md:w-[2000px] md:h-[2000px] bg-no-repeat bg-center bg-contain opacity-[1]"
                    style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
                >
                </div>
            </div>
            <Suspense fallback={<div className="bg-white h-16 border-b border-stone-200"></div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">

                <MobileFilterButton isOpen={showMobileFilters} onClick={() => setShowMobileFilters(!showMobileFilters)} />

                <aside className={`lg:block lg:w-72 shrink-0 transition-all duration-300 ease-in-out z-20 ${showMobileFilters ? 'block' : 'hidden'}`}>
                    <div className="sticky top-24">
                        <Suspense fallback={<div className="w-full h-96 bg-stone-200 animate-pulse rounded-xl"></div>}>
                            <Sidebar />
                        </Suspense>
                    </div>
                </aside>

                <section className="flex-1 min-w-0">

                    {isAuthenticated && user ? (
                        <>
                            <AuthenticatedBanner
                                user={user}
                                totalBookCount={totalCount}
                                onProfileClick={() => router.push('/profile')}
                            />

                            <QuickActionButtons
                                onBorrowClick={() => setIsBorrowModalOpen(true)}
                                onReturnClick={() => setIsReturnModalOpen(true)}
                            />
                        </>
                    ) : (
                        <GuestBanner />
                    )}

                    <div className="flex flex-col gap-4">
                        <ResultsInfo totalCount={totalCount} />
                        <BookGrid books={books} loading={loading} />
                    </div>

                    {!loading && totalCount > 0 && (
                        <div className="mt-10 flex justify-center pb-8">
                            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    )}
                </section>
            </main>

            <BorrowBookModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                bookTitle="Hızlı Ödünç İşlemi"
                onSuccess={() => {}}
            />

            <ReturnBookModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
            />

            {isMartyrModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-[#1a1a1a] border border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.4)] max-w-lg w-full overflow-hidden relative flex flex-col max-h-[90vh]">

                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-900 via-red-600 to-red-900 z-10"></div>

                        <div className="p-6 md:p-8 text-center overflow-y-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-transparent">
                            <div className="mb-5 flex justify-center">
                                <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center border border-red-800/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                    <span className="text-2xl grayscale-0">🇹🇷</span>
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-red-500 mb-2 tracking-wide drop-shadow-sm">
                                {MARTYR_INFO.title}
                            </h2>

                            <div className="w-24 h-0.5 bg-red-900/50 mx-auto mb-6"></div>

                            {MARTYR_INFO.images && MARTYR_INFO.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {MARTYR_INFO.images.map((imgUrl, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 shadow-lg group"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Şehitlerimiz ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-gray-200 text-lg font-medium leading-relaxed mb-3">
                                {MARTYR_INFO.message}
                            </p>

                            <p className="text-gray-500 text-sm italic mb-8 border-t border-white/5 pt-4">
                                {MARTYR_INFO.detail}
                            </p>

                            <button
                                onClick={handleCloseMartyrModal}
                                className="w-full sm:w-auto px-10 py-3 bg-gradient-to-b from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/30 text-sm tracking-wider uppercase border border-red-700/50"
                            >
                                Vatan Sağ Olsun, TÜRK Milleti Var Olsun !
                            </button>
                        </div>

                        <div className="bg-[#111] p-3 text-center border-t border-white/5 shrink-0">
                            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                                {MARTYR_INFO.date}
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}