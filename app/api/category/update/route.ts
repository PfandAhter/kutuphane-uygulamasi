import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        console.log("Proxy PUT /api/category/update called for ID:", id);
        await axios.put(`${API_BASE_URL}/api/Category/${id}`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy PUT /api/category/update successful for ID:", id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.log("Proxy Category Update Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Copy creation failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}