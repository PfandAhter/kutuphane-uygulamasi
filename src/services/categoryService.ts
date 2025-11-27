import {Category} from "@/src/types/category";

const API_ROUTE_BASE = "/api/category";

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const url = `${API_ROUTE_BASE}/list`;
        console.log("Fetching categories from URL:", url);
        const response = await fetch(url, {cache: "no-cache" });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        return response.json();
    }
}