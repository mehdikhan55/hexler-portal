import { uploadToCloudinary } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Step 2: Get the form data
        const formData = await req.formData();
        const projectName = formData.get('projectName');
        const projectTagline = formData.get('projectTagline');
        const projectDescription = formData.get('projectDescription');
        const projectCategory = formData.get('projectCategory');
        const projectImage = formData.get('projectImage') as File;
        const projectLink = formData.get('projectLink');
        const projectOrder = parseInt(formData.get('projectOrder') as string, 10);

        // Step 3: Upload the image to Cloudinary
        // if (!projectImage) {
        //     return NextResponse.json({ message: 'No image uploaded' }, { status: 400 });
        // }

        console.log('Project image:', projectImage);
        console.log("type of projectImage", typeof projectImage);
        let imageUrl;
        if(projectImage && projectImage instanceof File){
        const fileBuffer = await projectImage.arrayBuffer();
        const mimeType = projectImage.type;
        const encoding = "base64";
        const base64Data = Buffer.from(fileBuffer).toString("base64");

        const fileUri = `data:${mimeType};${encoding},${base64Data}`;

        const uploadResponse = await uploadToCloudinary(fileUri, projectImage.name);

        if (!uploadResponse.success) {
            return NextResponse.json({ message: 'Error uploading image to Cloudinary' }, { status: 500 });
        }

        imageUrl = uploadResponse.result.secure_url;
    }else{
        imageUrl = null;
    }
        // Step 4: Save the project to the database
        const newProject = new Project({
            projectName,
            projectTagline,
            projectDescription,
            projectCategory,
            projectImage: imageUrl,
            projectLink,
            projectOrder,
        });

        // Save to MongoDB
        const savedProject = await newProject.save();

        // Step 5: Return the success response with the project data
        return NextResponse.json({
            message: 'Project created successfully',
            project: savedProject,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ message: 'Error creating project' }, { status: 500 });
    }
}

export const revalidate = 0;