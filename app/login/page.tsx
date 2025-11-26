"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/src/services/authService';
import Header from '@/components/Header';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({ email, password });
            // Login successful, redirect to home
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Giriş yapılırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
            {/*<Header />*/}

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-100 w-full max-w-md">
                    <h2 className="text-2xl font-serif font-bold text-amber-950 mb-6 text-center border-b border-amber-100 pb-4">
                        Giriş Yap
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-800 p-3 rounded mb-4 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                                placeholder="******"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-900 text-amber-50 py-2 rounded font-serif font-bold hover:bg-amber-800 transition disabled:opacity-70"
                        >
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-stone-600">
                        Hesabınız yok mu?{' '}
                        <a href="/register" className="text-amber-800 font-bold hover:underline">
                            Kayıt Ol
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
