import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function PUT(request: NextRequest) {
    try {
        console.log("Proxy PUT /api/shelf/update called");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Shelf ID is required" }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        const response = await axios.put(`${API_BASE_URL}/api/Shelf/${id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Shelf Update Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { message: "Update failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}