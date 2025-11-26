// app/api/book/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.search; // ?Page=0&Size=10...

        const backendUrl = `${API_BASE_URL}/Book/get-all-books${query}`;

        const backendRes = await fetch(backendUrl, {
            method: "GET",
            headers: {
                // Tarayıcıdan gelen cookie'leri backend'e iletmek istersen:
                //cookie: req.headers.get("cookie") ?? "",
                // gerektiğinde ek header'lar eklenebilir
            },
            // server-side fetch için timeout/next cache ayarları eklenebilir
        });

        const contentType = backendRes.headers.get("content-type") ?? "application/json";
        const text = await backendRes.text();

        return new NextResponse(text, {
            status: backendRes.status,
            headers: { "content-type": contentType },
        });
    } catch (err) {
        console.error("Proxy GET /api/book hata:", err);
        return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
    }
}
