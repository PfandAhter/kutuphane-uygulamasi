'use client';

import React, { useEffect, useState } from 'react';
import { loanService } from '@/src/services/loanService';
import { LoanWithUserDetailsDto } from '@/src/types/loan';
import { PaginatedResult } from "@/src/types/book";
import LoanTable from '@/src/components/ui/Admin/LoanTable';
import Pagination from '@/src/components/ui/Admin/Common/PaginationControls';
import StatCard from '@/src/components/ui/Admin/StatCard';
import toast from 'react-hot-toast';

export default function OverdueLoansPage() {
    const [data, setData] = useState<PaginatedResult<LoanWithUserDetailsDto> | null>(null);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchLoans(currentPage);
    }, [currentPage]);

    const fetchLoans = async (page: number) => {
        setLoading(true);
        try {
            const result = await loanService.getHistoryLoans(page, pageSize);
            /*const overdueItems = result.items.filter(item => {
                const isNotReturned = item.isActive === true || item.actualReturnDate === null;

                const expectedDate = new Date(item.expectedReturnDate);
                const now = new Date();

                return isNotReturned && expectedDate < now;
            });
            setData({
                ...result,
                items: overdueItems,
            });*/
            setData(result);
        } catch (error) {
            toast.error("Gecikmiş iadeler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-red-800 font-serif">Geçmiş İadeler</h1>
                    <p className="text-red-500 text-sm">Teslim tarihi geçmiş ve henüz iade edilmemiş kitaplar.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* İstatistik kartında filtrelenmiş sayıyı gösteriyoruz */}
                <StatCard
                    title="Gecikmiş Ödünç"
                    value={data?.items.length || 0}
                    icon="⚠️"
                    trend="Acil"
                    trendDirection="up"
                />
            </div>

            <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                <LoanTable
                    loans={data?.items || []}
                    loading={loading}
                    emptyMessage="Harika! Şu an gecikmiş bir iade bulunmuyor."
                    isOverdueList={true}
                />

                {data && (
                    <Pagination
                        currentPage={currentPage}
                        pageSize={data.totalPages} // Burası pageSize değil totalPages olmalı
                        totalCount={data.totalCount}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </div>
    );
}