import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        const response = await axios.get(`${API_BASE_URL}/api/Dashboard`, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Dashboard Stats Error:", err?.message);

        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Dashboard status get işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}