import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
axiosInstance.interceptors.response.use(
    (response) => response, // Başarılı cevapları elleme
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("⚠️ 401 Hatası alındı, Token yenileniyor...");
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const token = localStorage.getItem("token");

                if (!refreshToken) {
                    throw new Error("Refresh token bulunamadı.");
                }

                const refreshResponse = await axios.post(`${API_BASE_URL}/api/Auth/refresh-token`, {
                    refreshToken: refreshToken,
                    token: token
                });

                const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                if (!newAccessToken) {
                    throw new Error("Yeni Access Token alınamadı.");
                }

                localStorage.setItem('token', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
                console.log("✅ Token başarıyla yenilendi.");
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("❌ Oturum yenilenemedi:", refreshError);

                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userProfile');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;