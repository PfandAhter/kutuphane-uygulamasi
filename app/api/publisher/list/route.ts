import {NextRequest, NextResponse} from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        console.log("Proxy GET /api/publisher/list called");
        const response = await axios.get(`${API_BASE_URL}/api/Publishers`,{
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });

        console.log("Proxy GET /api/publisher/list succeeded");
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: { "content-type": "application/json" },
        })
    } catch (err: any) {
        console.error("Proxy GET /api/publisher/list error: ", err?.message);

        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Publisher Listeleme işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}