import axiosInstance from "@/src/utils/axiosInstance";
import {AssignFineDto, FineType} from "@/src/types/fine";

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

    payFine: async (userId: string): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/pay`, { userId }, {
            baseURL: ''
        });
    }
}