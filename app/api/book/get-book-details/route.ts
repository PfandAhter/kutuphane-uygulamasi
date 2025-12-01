// src/app/api/book/get-book-details/route.ts
import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('id');

        console.log("Server Side - Query Param ile gelen ID:", bookId);

        if (!bookId) {
            return NextResponse.json({ error: "id parametresi eksik." }, { status: 400 });
        }

        const response = await axios.get(`${API_BASE_URL}/api/Book/get-book-details/${bookId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, { status: 200 });

    } catch (error: any) {
        console.error("Proxy GET Error:", error?.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data?.message || "Kitap detayları alınamadı.";

        return NextResponse.json({ error: message }, { status });
    }
}