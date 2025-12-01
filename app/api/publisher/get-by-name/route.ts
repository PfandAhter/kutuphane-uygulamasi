import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const authHeader = request.headers.get("Authorization");

        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

        console.log("Proxy GET /api/publisher/get-by-name called for Name:", name);
        const response = await axios.get(`${API_BASE_URL}/api/Publishers/by-name`, {
            params: { name },
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy GET /api/publisher/get-by-name successful for Name:", name);
        return NextResponse.json(response.data, { status: 200 });

    } catch (err: any) {
        console.error("Proxy Publisher Get By Name Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Publisher get-by-name failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}