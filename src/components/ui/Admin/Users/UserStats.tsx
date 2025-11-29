import React from 'react';
import StatCard from '@/src/components/ui/Admin/StatCard';

interface Props {
    totalCount: number;
}

export default function UserStats({ totalCount }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4 mb-2">
                <h1 className="text-2xl font-bold text-stone-800 font-serif">Üye Yönetimi</h1>
                <p className="text-stone-500 text-sm">Kayıtlı üyeleri görüntüleyin, düzenleyin veya engelleyin.</p>
            </div>
            <StatCard title="Toplam Üye" value={totalCount} icon="👥" trendDirection="up" />
            <StatCard title="Cezalı Üyeler" value="-" icon="🚫" trendDirection="neutral" />
            <StatCard title="Aktif Okuyucular" value="-" icon="📖" trendDirection="up" />
        </div>
    );
}