import {NextRequest, NextResponse} from 'next/server';

import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request:NextRequest) {
    try {
        console.log("Proxy GET /api/room/list called");
        const authHeader = request.headers.get("Authorization");
        const config = {
            headers: {
                "Content-Type": "application/json",
                // Eğer header varsa ekle, yoksa boş geç (Spread operator)
                ...(authHeader && { "Authorization": authHeader })
            }
        };

        const response = await axios.get(`${API_BASE_URL}/api/Room`,config); // Room/list endpointi haline gelecek..

        console.log("Proxy GET /api/room/list succeeded");
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                "Content-type": "application/json"
            },
        });
    } catch (err: unknown) {
        console.error("Proxy GET /api/room/list hata:", err);
        const status = err.response?.status || 500;
        const data = err.response?.data || { error: "Proxy failed" };

        return NextResponse.json(data, { status: status });
    }
}