import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const authHeader = request.headers.get("Authorization");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        console.log("Proxy DELETE /api/author/delete called for ID:", id);
        const response = await axios.delete(`${API_BASE_URL}/api/Authors/${id}`, {
            headers: { ...(authHeader && { "Authorization": authHeader }) }
        });

        console.log("Proxy DELETE /api/author/delete successful for ID:", id);
        return NextResponse.json(response.data, { status: 200 });
    } catch (err: any) {
        console.error("Proxy DELETE /api/author/delete Error:", err?.message);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Author Delete failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}