import React from 'react';

import AdminSidebar from '@/src/components/ui/Admin/AdminSidebar';
import AdminHeader from '@/src/components/ui/Admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-stone-100 font-sans flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminHeader /> {/* Header buraya eklendi */}
                <div className="p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}