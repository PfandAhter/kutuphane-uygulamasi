import React from 'react';
import StatCard from '@/src/components/ui/Admin/StatCard';

interface Props {
    totalCount: number;
    penalizedCount: number;
    activeReaderCount: number;
}

export default function UserStats({ totalCount, penalizedCount, activeReaderCount }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4 mb-2">
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Üye Yönetimi</h1>
                <p className="text-stone-500 text-sm">Kayıtlı üyeleri görüntüleyin, düzenleyin veya engelleyin.</p>
            </div>

            <StatCard
                title="Toplam Üye"
                value={totalCount}
                icon="👥"
                trendDirection="up"
            />

            <StatCard
                title="Cezalı Üyeler"
                value={penalizedCount}
                icon="🚫"
                trendDirection={penalizedCount > 0 ? "down" : "neutral"}
            />

            <StatCard
                title="Aktif Okuyucular"
                value={activeReaderCount}
                icon="📖"
                trendDirection="up"
            />
        </div>
    );
}