"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/authService';
import Header from '@/src/components/ui/Header';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            // Register successful, redirect to login
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Kayıt olurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
            {/*<Header />*/}

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-100 w-full max-w-lg">
                    <h2 className="text-2xl font-serif font-bold text-amber-950 mb-6 text-center border-b border-amber-100 pb-4">
                        Kayıt Ol
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-800 p-3 rounded mb-4 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Ad</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Soyad</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Telefon Numarası</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="5XX XXX XX XX"
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Doğum Tarihi</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Şifre</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-amber-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-900 text-amber-50 py-2 rounded font-serif font-bold hover:bg-amber-800 transition disabled:opacity-70 mt-2"
                        >
                            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-stone-600">
                        Zaten hesabınız var mı?{' '}
                        <a href="/login" className="text-amber-800 font-bold hover:underline">
                            Giriş Yap
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
