import axiosInstance from "@/src/utils/axiosInstance";
import {CreateLoanDto, LoanWithUserDetailsDto} from '@/src/types/loan';
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/loans";

export const loanService = {
    createLoan: async (dto: CreateLoanDto): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/create`, dto, {
            baseURL: ''
        });
    },

    getAllActiveLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/active?page=${page}&pageSize=${size}`, {
            baseURL: ''
        });
        return response.data;
    },

    getOverdueLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/overdue?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    },

    getHistoryLoans: async (page: number = 1, size: number = 10): Promise<PaginatedResult<LoanWithUserDetailsDto>> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/history?page=${page}&pageSize=${size}`, {
            baseURL: '',
        });
        return response.data;
    },

    returnBook: async (loanId: number): Promise<void> => {
        await axiosInstance.post(`${API_ROUTE_BASE}/loans/return/${loanId}`,{
            baseURL: '',
        });
    }
};