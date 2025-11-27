import { LoginDto, RegisterDto, AuthResponse } from "../types/auth";

const API_ROUTE_BASE = "/api/auth";

export const authService = {
    async login(dto: LoginDto): Promise<AuthResponse> {
        const response = await fetch(`${API_ROUTE_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });

        console.log("Login response status:", response.status);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Giriş başarısız.");
        }
        return response.json();
    },

    async register(dto: RegisterDto): Promise<void> {
        const response = await fetch(`${API_ROUTE_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });
        console.log("Register response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Kayıt başarısız.");
        }
    }
};