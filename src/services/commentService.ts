import axiosInstance from "@/src/utils/axiosInstance";
import { BookComment, CreateCommentDto, PaginatedComments } from "@/src/types/comment";

const API_ROUTE_BASE = '/api/comments';

export const commentService = {
    getComments: async (bookId: number, page: number = 1, size: number = 5): Promise<PaginatedComments> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list`, {
            params: { bookId, page, size }
        });
        return response.data;
    },

    addComment: async (dto: CreateCommentDto): Promise<BookComment> => {
        const response = await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto);
        return response.data;
    },

    deleteComment: async (commentId: number): Promise<void> => {
        await axiosInstance.delete(`${API_ROUTE_BASE}/delete?id=${commentId}`);
    }
};