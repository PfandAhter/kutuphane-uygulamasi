'use client';

import React ,{ useEffect } from 'react';
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";

import AdminSidebar from '@/src/components/ui/Admin/AdminSidebar';
import AdminHeader from '@/src/components/ui/Admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!isLoading){
            if(!user){
                router.replace("/login");
            }else if (!user.roles.includes('Admin')){
                router.push("/");
            }
        }
    }, [user,router,isLoading]);

    if(isLoading || !user || !user.roles.includes('Admin')){
        return <div>Yetki kontrol ediliyor...</div>;
    }

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