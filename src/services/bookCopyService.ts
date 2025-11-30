import axiosInstance from "@/src/utils/axiosInstance";
import {CreateBookCopyResponseDto, CreateCopyBookDto} from "@/src/types/book";

const API_ROUTE_BASE = "/api/book-copy";

export const bookCopyService = {
    createCopy: async (dto: CreateCopyBookDto): Promise<CreateBookCopyResponseDto> => {
        console.log("Book Copy Service - CreateCopy called");
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });

        return response.data;
    }
}