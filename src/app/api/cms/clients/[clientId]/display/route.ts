// /api/cms/clients/[clientId]/display/route.ts
import { NextRequest, NextResponse } from "next/server";
import CMSClient from "@/models/cmsClient";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    await dbConnect();
    const { display } = await req.json();

    const updatedClient = await CMSClient.findByIdAndUpdate(
      params.clientId,
      { display },
      { new: true }
    );

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Display status updated successfully", client: updatedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating client display status:", error);
    return NextResponse.json(
      { message: "Error updating client display status" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;