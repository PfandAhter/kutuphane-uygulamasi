import { NextResponse } from "next/server";
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_PUBLIC_API_BASE_URL;

export async function GET(){
    try{
        console.log("Proxy GET /api/category/list called");
        console.log("Using API_BASE_URL:", API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/api/Category/list`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // You can add params here if needed
        });
        if (response.status !== 200) {
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: response.status });
        }

        console.log("Proxy GET /api/category/list called successfully");
        return NextResponse.json(response.data);
    }catch(err){
        console.error("Proxy GET /api/category/list error:", err);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 404 });
    }
}