import {NextResponse, NextRequest} from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest){
    try{
        const body = await request.json();

        const response = await axios.post(`${API_BASE_URL}/api/Auth/login`,body,{
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, {status: 200});
    }catch(err){
        console.error("Proxy POST /api/auth/login error:", err);
        return NextResponse.json({ error: "Giriş başarısız." }, { status: 401 });
    }
}