import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        console.log("Proxy POST /api/Category/create called");
        const response = await axios.post(`${API_BASE_URL}/api/Category/create`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy POST /api/Category/create called successfully");

        return NextResponse.json(response.data, { status: 201 });
    } catch (err: any) {
        console.error("Proxy Category Add Error:", err?.message);
        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Category Create işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}