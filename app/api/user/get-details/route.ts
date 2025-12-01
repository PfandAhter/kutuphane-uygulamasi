import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        console.log(`Proxy GET /api/users/get-details called. ID: ${id}`);
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/User/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error(`Proxy User Details Error:`, err?.message);

        const status = err.response?.status || 500;
        const data = err.response?.data || { error: "User fetch failed" };
        return NextResponse.json(data, { status: status });
    }
}