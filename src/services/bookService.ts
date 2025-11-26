import type { BookFilterDto, PaginatedResult, Book } from "../types/book";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api";

const API_ROUTE_BASE = "/api/book";

export const bookService = {
    async getAllBooks(filter: BookFilterDto): Promise<PaginatedResult<Book>> {
        const params = new URLSearchParams();

        if (filter.title) params.append("Title", filter.title);
        if (filter.categoryId) params.append("CategoryId", filter.categoryId.toString());
        if (filter.publicationYearFrom) params.append("PublicationYearFrom", filter.publicationYearFrom.toString());
        if (filter.publicationYearTo) params.append("PublicationYearTo", filter.publicationYearTo.toString());
        if (filter.language) params.append("Language", filter.language);
        if (filter.pageCountMin) params.append("PageCountMin", filter.pageCountMin.toString());
        if (filter.pageCountMax) params.append("PageCountMax", filter.pageCountMax.toString());
        if (filter.hasAvailableCopy !== undefined) params.append("HasAvailableCopy", filter.hasAvailableCopy.toString());
        if (filter.roomCode) params.append("RoomCode", filter.roomCode);

        params.append("Page", (filter.page || 0).toString());
        params.append("Size", (filter.size || 10).toString());

        const url = `${API_ROUTE_BASE}/list?${params.toString()}`;

        const response = await fetch(url, { cache: "no-store" }); // Force-cache yapilabilir ama derste sikinti olabilir.
        console.log("Book Service Response:", response);

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        return response.json();
    },

    /*async getBookById(id: number): Promise<Book> {
        const response = await fetch(`${API_BASE_URL}/Book/get-book/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch book");
        }
        return response.json();
    },*/

    async getBookDetails(id: number): Promise<Book> {
        const url = `${API_ROUTE_BASE}/get-book-details/${id}`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            throw new Error("Failed to fetch book details");
        }
        return response.json();
    }
};