import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto } from "@/src/types/auth";

const API_ROUTE_BASE = "/api/auth";

export const authService = {
    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse>{
        const response = await fetch(`${API_ROUTE_BASE}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(refreshTokenDto),
        });

        console.log("Refresh token response status:", response.status);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Token yenileme başarısız.");
        }
        return response.json();
    },

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

export const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
    }
    return {
        'Content-Type': 'application/json',
    };
};