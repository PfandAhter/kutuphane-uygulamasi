import axiosInstance from "@/src/utils/axiosInstance";
import {Author, CreateAuthorDto} from "@/src/types/publisherAndAuthor";

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
    },

    createAuthor: async (dto: CreateAuthorDto): Promise<Author> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
        return response.data;
    }
};