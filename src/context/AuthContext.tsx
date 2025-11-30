'use client';

import React, {createContext, useContext, useState} from 'react';
import {AuthContextType} from "@/src/types/authContextType";
import {AuthResponse, LoginDto, RegisterDto, UserProfile} from "@/src/types/auth";
import {authService} from "@/src/services/authService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): UserProfile | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem("token");
    const userProfileString = localStorage.getItem("userProfile");

    const refreshToken = localStorage.getItem("refreshToken");


    if ((token && userProfileString) && !refreshToken) {
        try {
            return JSON.parse(userProfileString);
        } catch (err) {
            console.error("Error parsing user profile from localStorage", err);
            localStorage.removeItem("userProfile");
            localStorage.removeItem("token");
            return null;
        }
    }
    return null;
};

const getInitialToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(() => getInitialUser());
    const [token, setToken] = useState<string | null>(() => getInitialToken());
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async (dto: LoginDto) => {
        try {
            setIsLoading(true);
            console.log("AuthContext login called for user email:", dto.email);
            const response: AuthResponse = await authService.login(dto);

            localStorage.setItem("token", response.token);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("userProfile", JSON.stringify(response.user));

            setRefreshToken(response.refreshToken);
            setToken(response.token);
            setUser(response.user);
        } catch (error) {
            console.log("Login error:", error);
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
            console.log("Register error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        setToken(null);
        setUser(null);
    };

    // userId'yi user objesinden türet (user.id veya user.userId - senin UserProfile yapına göre)
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