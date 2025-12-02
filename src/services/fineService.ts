import axiosInstance from "@/src/utils/axiosInstance";
import {AssignFineDto, FineType} from "@/src/types/fine";
import {UserFineDto} from "@/src/types/user";

const API_ROUTE_BASE = "/api/fine";


export const fineService = {
    getFineTypes: async (): Promise<FineType[]> => {
        try {
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/types`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Ceza tipleri alma hatası:", error);
            return [];
        }
    },

    assignFine: async (dto: AssignFineDto): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/assign`, dto, {
            baseURL: ''
        });
    },

    revokeFineById: async (fineId: number): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/revoke?id=${fineId}`, {}, { baseURL: '' });
    },

    getUserFinesByEmail: async (email: string): Promise<UserFineDto[]> => {
        try {
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/user-fines?email=${email}`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Kullanıcı cezaları alınamadı:", error);
            return [];
        }
    },

    payFine: async (userId: string): Promise<void> => { //TODO: Burada kullanici kendi yapacagi icin admin yetkisi gerekmeyecek.
        await axiosInstance.post(`${API_ROUTE_BASE}/pay`, { userId }, {
            baseURL: ''
        });
    }
}