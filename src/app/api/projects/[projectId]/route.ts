import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/project";
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/lib/storage";

export async function PUT(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    const formData = await req.formData();
    const projectName = formData.get('projectName');
    const projectTagline = formData.get('projectTagline');
    const projectDescription = formData.get('projectDescription');
    const projectCategory = formData.get('projectCategory');
    const projectImage = formData.get('projectImage') as File;
    const updatedImage = formData.get('updatedImage') as File;
    const projectLink = formData.get('projectLink');
    const projectOrder = parseInt(formData.get('projectOrder') as string, 10);

    const projectId = req.nextUrl.pathname.split('/')[3]

    if (!projectId || !formData) {
      return NextResponse.json(
        { message: "Missing projectId or updatedData" },
        { status: 400 } // Bad request
      );
    }


    let updatedData;

    //@ts-ignore
    if (projectImage==="null" && updatedImage!=="null") {
      // if new image is uploaded
      const fileBuffer = await updatedImage.arrayBuffer();
        const mimeType = updatedImage.type;
        const encoding = "base64";
        const base64Data = Buffer.from(fileBuffer).toString("base64");

        const fileUri = `data:${mimeType};${encoding},${base64Data}`;

        const uploadResponse = await uploadToCloudinary(fileUri, updatedImage.name);

        if (!uploadResponse.success) {
            return NextResponse.json({ message: 'Error uploading image to Cloudinary' }, { status: 500 });
        }

        const imageUrl = uploadResponse.result.secure_url;
        
        updatedData = {
          projectName,
          projectTagline,
          projectDescription,
          projectCategory,
          projectImage: imageUrl,
          projectLink,
          projectOrder,
        };
    }
    //@ts-ignore
    else if (projectImage==="null" && updatedImage==="null") {
      // if no new image is uploaded and previous image is removed
      updatedData = {
        projectName,
        projectTagline,
        projectDescription,
        projectCategory,
        projectImage: null,
        projectLink,
        projectOrder,
      };
      //@ts-ignore
    } else if (projectImage!=="null" && updatedImage==="null") {
      // if no new image is uploaded
      console.log('heelo')
      updatedData = {
        projectName: projectName,
        projectTagline,
        projectDescription,
        projectCategory,
        projectImage: projectImage,
        projectLink,
        projectOrder,
      };
    }

    console.log("updatedData", updatedData);
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }
    console.log("updatedProject", updatedProject);
    return NextResponse.json(
      { project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error updating project' },
      { status: 500 } // Internal server error
    );
  }
}

//get single project
export async function GET(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get the projectId from the URL
    const projectId = req.nextUrl.pathname.split('/')[3];

    // Step 3: Find the project by projectId
    const project = await Project.findById(projectId).populate({ path: 'projectCategory', select: 'name description' });
    console.log("project", project);

    // Step 4: Check if the project was found
    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 } // Not found
      );
    }

    // Step 5: Return the project as a response
    return NextResponse.json(
      { project },
      { status: 200 } // Success
    );
  } catch (error) {
    console.error('Error getting project:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error getting project' },
      { status: 500 } // Internal server error
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get the projectId from the URL
    const projectId = req.nextUrl.pathname.split('/')[3];

    // Step 3: Find the project by projectId and delete it
    const deletedProject = await Project.findByIdAndDelete(projectId);

    // Step 4: Check if the project was found and deleted
    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 } // Not found
      );
    }

    // Step 5: Return the deleted project as a response
    return NextResponse.json(
      { project: deletedProject },
      { status: 200 } // Success
    );
  } catch (error) {
    console.error('Error deleting project:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error deleting project' },
      { status: 500 } // Internal server error
    );
  }
}

export const revalidate = 0;