import {NextRequest, NextResponse} from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


export async function POST(request: NextRequest) {
    try {
        console.log("Proxy POST /api/auth/register called");
        const body = await request.json();

        const response = await axios.post(`${API_BASE_URL}/api/Auth/register`, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Proxy POST /api/auth/register called successfully");

        return NextResponse.json(response.data, {status: 200});
    } catch (err) {
        console.error("Proxy POST /api/auth/register error:", err);
        return NextResponse.json({error: "Kayıt başarısız."}, {status: 401});
    }
}