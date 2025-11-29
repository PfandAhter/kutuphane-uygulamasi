import axiosInstance from "@/src/utils/axiosInstance";
import { Publisher } from '@/src/types/bookDetail';

const API_ROUTE_BASE = "/api/publisher";

export const publisherService = {
    getAllPublishers: async (): Promise<Publisher[]> => {
        try{
            console.log("Fetching publishers from API")
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/list`, {
                baseURL: ''
            });
            return response.data;
        }catch(error){
            console.error("Error fetching publishers:", error);
            return [];
        }
    }
};