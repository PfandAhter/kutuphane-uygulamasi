import axiosInstance from "@/src/utils/axiosInstance";
import {UserFilterDto, UserViewDto} from "@/src/types/user";
import {PaginatedResult} from "@/src/types/book";

const API_ROUTE_BASE = "/api/user";

export const userService = {
    getAllUsers: async (filter: UserFilterDto): Promise<PaginatedResult<UserViewDto>> => {
        const params = new URLSearchParams();

        if (filter.firstName) params.append("FirstName", filter.firstName);
        if (filter.lastName) params.append("LastName", filter.lastName);
        if (filter.email) params.append("Email", filter.email);
        if (filter.role && filter.role !== "Tümü") params.append("Role", filter.role);
        if (filter.hasFine !== undefined) params.append("HasFine", filter.hasFine.toString());

        params.append("Page", filter.page.toString());
        params.append("Size", filter.size.toString());

        // Proxy Route'a istek (baseURL: '' önemli)
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/list?${params.toString()}`, {
            baseURL: ''
        });
        return response.data;
    },

    getUserById: async (id: string): Promise<UserViewDto> => {
        const response = await axiosInstance.get(`${API_ROUTE_BASE}/get-details?id=${encodeURIComponent(id)}`, {
            baseURL: ''
        });
        return response.data;
    }
}