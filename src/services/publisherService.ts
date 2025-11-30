import axiosInstance from "@/src/utils/axiosInstance";
import {Publisher, CreatePublisherDto} from "@/src/types/publisherAndAuthor";

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
    },
    createPublisher: async (dto: CreatePublisherDto): Promise<Publisher> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, { baseURL: '' });
        return response.data;
    }
};