import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        console.log("Query Parameters for Author Books:", queryParams);
        const response = await axios.get(`${API_BASE_URL}/api/Book/other-by-author`, {
            params: queryParams,
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error("Proxy List Error:", error?.message);

        const status = error.response?.status || 500;
        const message = error.response?.data?.message || "Kitap listesi alınırken hata oluştu.";

        return NextResponse.json({ error: message }, { status });
    }
}