import { NextResponse } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.search;

        console.log("Proxy GET /api/publisher/list/pageable called with query:", query);
        const response = await axios.get(`${API_BASE_URL}/api/Publishers/pageable${query}`);

        console.log("Proxy GET /api/publisher/list/pageable successful.");
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: { "content-type": "application/json" },
        })
    }
    catch (err: any) {
        console.error("Proxy GET /api/publisher hata:", err?.message);

        const status = err.response?.status || 500;

        if (status === 404) {
            return NextResponse.json(null, { status: 200 });
        }
        const data = err.response?.data || { error: "Publisher Pageable Listeleme işlemi başarısız." };
        return NextResponse.json(data, { status: status });
    }
}