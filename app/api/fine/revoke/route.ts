import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        console.log(`Proxy POST /api/fine/revoke called with ID: ${id}`);

        if (!id) {
            return NextResponse.json({ error: "Fine ID is required" }, { status: 400 });
        }

        const authHeader = request.headers.get("Authorization");
        await axios.post(`${API_BASE_URL}/api/Fine/revoke/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy POST /api/fine/revoke successful for ID:", id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Revoke Error:", err?.message);

        const status = err.response?.status || 500;
        const data = err.response?.data || { error: "Revoke failed" };

        return NextResponse.json(data, { status: status });
    }
}