import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const body = await request.json();

        console.log("Proxy POST /api/Fines/pay called");
        await axios.post(`${API_BASE_URL}/api/Fines/pay`, body, {
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy POST /api/Fines/pay called successfully");
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Proxy Fine Pay Error:", err?.message);
        if (err.response){
            return NextResponse.json(err.response.data || { error: "Fine Pay işlemi başarısız." }, { status: err.response.status });
        }
        return NextResponse.json(
            { message: "Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}