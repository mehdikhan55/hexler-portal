// /api/cms/clients/active-clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import CMSClient from "@/models/cmsClient";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Find all clients where display is true
        const activeClients = await CMSClient.find({ display: true }).sort({ createdAt: -1 });
        return NextResponse.json({ clients: activeClients }, { status: 200 });
    } catch (error) {
        console.error("Error getting active clients:", error);
        return NextResponse.json(
            { message: "Error getting active clients" },
            { status: 500 }
        );
    }
}

export const revalidate = 0;