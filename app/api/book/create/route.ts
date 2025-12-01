import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
    try {
        console.log("Proxy POST /api/book/add called");

        const authHeader = request.headers.get("Authorization");

        const body = await request.json();

        const response = await axios.post(`${API_BASE_URL}/api/Book/add-book`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 201 });
    } catch (err: any) {
        console.error("Proxy Book Add Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Book creation failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}