import { NextRequest, NextResponse } from "next/server";
import CMSClient from "@/models/cmsClient";
import dbConnect from "@/lib/dbConnect";


export async function GET(
    req: NextRequest,
    { params }: { params: { clientId: string } }
  ) {
    try {
      await dbConnect();
      const client = await CMSClient.findById(params.clientId);
      
      if (!client) {
        return NextResponse.json(
          { message: "Client not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ client }, { status: 200 });
    } catch (error) {
      console.error("Error getting client:", error);
      return NextResponse.json(
        { message: "Error getting client" },
        { status: 500 }
      );
    }
  }
  
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { clientId: string } }
  ) {
    try {
      await dbConnect();
      const client = await CMSClient.findByIdAndDelete(params.clientId);
  
      if (!client) {
        return NextResponse.json(
          { message: "Client not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Client deleted successfully", client },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json(
        { message: "Error deleting client" },
        { status: 500 }
      );
    }
  }

  export const revalidate = 0;
