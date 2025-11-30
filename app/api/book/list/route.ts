// app/api/book/route.ts
import { NextResponse } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.search; // ?Page=0&Size=10...

        console.log("Query Information ", query);

        const response = await axios.get(`${API_BASE_URL}/api/Book/get-all-books${query}`);

        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: { "content-type": "application/json" },
        })
    } catch (err: any) {
        console.error("Proxy GET /api/book hata:", err?.message);

        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Book Listeleme işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}