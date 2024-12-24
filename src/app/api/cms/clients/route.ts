// /api/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import CMSClient from "@/models/cmsClient";
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/lib/storage";

// Get all clients
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const clients = await CMSClient.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ clients }, { status: 200 });
    } catch (error) {
        console.error("Error getting clients:", error);
        return NextResponse.json(
            { message: "Error getting clients" },
            { status: 500 }
        );
    }
}

// Add a new client
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();
        const clientName = formData.get('name');
        const clientImage = formData.get('image') as File;

        let imageUrl;
        if (clientImage && clientImage instanceof File) {
            const fileBuffer = await clientImage.arrayBuffer();
            const mimeType = clientImage.type;
            const encoding = "base64";
            const base64Data = Buffer.from(fileBuffer).toString("base64");

            const fileUri = `data:${mimeType};${encoding},${base64Data}`;

            const uploadResponse = await uploadToCloudinary(fileUri, clientImage.name);

            if (!uploadResponse.success) {
                return NextResponse.json({ message: 'Error uploading image to Cloudinary' }, { status: 500 });
            }

            imageUrl = uploadResponse.result.secure_url;
        } else {
            return NextResponse.json({ message: 'No image uploaded' }, { status: 400 });
        }

        // Save the Client to the database
        const newClient = new CMSClient({
            name: clientName,
            image: imageUrl,
        });

        // Create new client
        const savedClient = await newClient.save();

        return NextResponse.json(
            { message: "Client created successfully", client: savedClient },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding client:", error);
        return NextResponse.json(
            { message: "Error adding client" },
            { status: 500 }
        );
    }
}

export const revalidate = 0;