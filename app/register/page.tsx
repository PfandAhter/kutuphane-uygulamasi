"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/authService';
import toast from 'react-hot-toast';

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
        const toastId = toast.loading("Kayıt işlemi başlatılıyor.")
        setLoading(true);

        try {
            await authService.register(formData);

            toast.success("Kayıt işlemi başarılıdır. Giriş sayfasına yönlendiriliyorsunuz...", { id : toastId});
            setTimeout(() =>{
                router.push('/login');
            },1000);
        } catch (err: any) {
            toast.error("Kayıt işlemi başarısız. Lütfen tekrar deneyin.", {id: toastId});
            setError(err.message || 'Kayıt olurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f3e5d0] relative">
            <div className="w-full max-w-lg bg-[#f6dcb7] rounded-2xl shadow-xl shadow-[#b47b3c33] p-10 border border-[#c79f74] space-y-6">
                <div>
                    <h1 className="text-3xl font-semibold text-[#2f1b10]">
                        Kütüphaneye Üyelik
                    </h1>
                    <p className="mt-1 text-sm text-[#5c4735]">
                        Ad, soyad, iletişim ve doğum tarihinizle kütüphaneye üye olun.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Ad
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleChange(e)}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Soyad
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleChange(e)}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            Telefon Numarası
                        </label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange(e)}
                            placeholder="5xx xxx xx xx"
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange(e)}
                            className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Parola
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange(e)}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#4a2f1c] mb-1">
                                Doğum Tarihi
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleChange(e)}
                                className="w-full rounded-md border border-[#b2824b] px-3 py-2 text-sm bg-[#fff9f1] text-black placeholder:text-[#7a6a58] focus:outline-none focus:ring-2 focus:ring-[#a15c2f]"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center rounded-md bg-[#7a4c24] px-4 py-2 text-sm font-semibold text-[#fdf3e6] hover:bg-[#5f391b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Kayıt yapılıyor..." : "Üye Ol"}
                    </button>
                </form>

                <p className="text-xs text-[#6a5a4a]">
                    Zaten üye misiniz?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-[#7a4c24] hover:text-[#5f391b]"
                    >
                        Giriş yapın
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
