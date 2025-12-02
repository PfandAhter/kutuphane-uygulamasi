import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

const API_ROUTE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request:NextRequest){
    try{
        const url = new URL(request.url);
        const query = url.search;

        console.log("Proxy GET /api/loans/history called with query:", query);

        const authHeader = request.headers.get("Authorization");
        const response = await axios.get(`${API_ROUTE_URL}/api/Loan/get-all-loans${query}`,{
            headers: {
                "Content-Type": "application/json",
                ...(authHeader && { "Authorization": authHeader })
            }
        });
        console.log("Proxy GET /api/loans/history successful");
        return NextResponse.json(response.data, { status: 200 });
    }catch(err:any){
        console.error("Proxy Loans History Error:", err);

        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || { error: "Loans history fetch failed" };
        return NextResponse.json(errorMessage, { status: status });
    }
}