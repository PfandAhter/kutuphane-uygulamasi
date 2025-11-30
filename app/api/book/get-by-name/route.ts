import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        console.log(`Proxy GET /api/book/get-by-name called. Searching for: ${name}`);

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: "Kitap ismi zorunludur." }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/Book/get-by-name`, {
            params: { name: name },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Search Error:", err?.message);

        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Book Arama işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}