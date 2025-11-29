import axiosInstance from "@/src/utils/axiosInstance";
import {Author} from '@/src/types/bookDetail';

const API_ROUTE_BASE = "/api/author";

export const authorService = {
    getAllAuthors: async (): Promise<Author[]> => {
        try {
            console.log("Fetching authors from API");
            const response = await axiosInstance.get(`${API_ROUTE_BASE}/list`, {
                baseURL: ''
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching authors:", error);
            return [];
        }
    }
};