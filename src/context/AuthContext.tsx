'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from "@/src/types/authContextType";
import { AuthResponse, LoginDto, RegisterDto, UserProfile } from "@/src/types/auth";
import { authService } from "@/src/services/authService";
import { userService } from "@/src/services/userService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: Başlangıç tokenını al (Server-Client uyumsuzluğunu önlemek için sadece client'ta çalışır)
const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("token");
    }
    return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. State'leri boş başlatıyoruz (Hydration Error önlemek için)
    const [user, setUser] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // 2. KRİTİK: Başlangıçta loading TRUE olmalı. Yoksa veri okunmadan sayfadan atar.
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 3. Sayfa yüklendiğinde (Mount) LocalStorage'ı oku
    useEffect(() => {
        const initializeAuth = () => {
            if (typeof window !== 'undefined') {
                const storedToken = localStorage.getItem("token");
                const storedRefreshToken = localStorage.getItem("refreshToken");
                const storedUserProfile = localStorage.getItem("userProfile");

                // Token ve Profil varsa state'i doldur
                if (storedToken && storedUserProfile) {
                    try {
                        const parsedUser = JSON.parse(storedUserProfile);
                        setToken(storedToken);
                        setRefreshToken(storedRefreshToken);
                        setUser(parsedUser);
                    } catch (error) {
                        console.error("Auth verisi bozuk, temizleniyor:", error);
                        localStorage.clear();
                    }
                }
            }
            // İşlem bitti, yükleme durumunu kapat
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (dto: LoginDto) => {
        try {
            setIsLoading(true);
            const response: AuthResponse = await authService.login(dto);

            // Önce Token'ı kaydet (UserService token kullanıyor olabilir)
            localStorage.setItem("token", response.token);
            localStorage.setItem("refreshToken", response.refreshToken);

            // Sonra kullanıcı bilgisini çek
            const userProfileDetails: UserProfile = await userService.getUserInfo();
            localStorage.setItem("userProfile", JSON.stringify(userProfileDetails));

            // State'leri güncelle
            setRefreshToken(response.refreshToken);
            setToken(response.token);
            setUser(userProfileDetails);
        } catch (error) {
            console.error("Login error:", error);
            // Hata durumunda yarım kalmış verileri temizle
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (dto: RegisterDto) => {
        try {
            setIsLoading(true);
            await authService.register(dto);
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        // İsteğe bağlı: Router ile login sayfasına yönlendirilebilir
    };

    const userId = user?.id ?? null;

    return (
        <AuthContext.Provider value={{
            user,
            userId,
            token,
            refreshToken,
            isAuthenticated: !!user && !!token,
            login,
            register,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};