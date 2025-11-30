import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
    try {
        console.log("Proxy POST /api/copy/add called");
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        const response = await axios.post(`${API_BASE_URL}/api/Book/add-book-copy`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        return NextResponse.json(response.data, { status: 201 });

    } catch (err: any) {
        console.error("Proxy Copy Add Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Copy creation failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}