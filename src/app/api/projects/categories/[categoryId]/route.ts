import { NextRequest, NextResponse } from "next/server";
import ProjectCategory from "@/models/projectCategory";
import dbConnect from "@/lib/dbConnect";

export async function PUT(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    const categoryId = req.nextUrl.pathname.split('/')[4]

    if (!categoryId ) {
      return NextResponse.json(
        { message: "Missing categoryId or updatedData" },
        { status: 400 } // Bad request
      );
    }

    const  updatedData  = await req.json();   

  
    const updatedCategory = await ProjectCategory.findByIdAndUpdate(
      categoryId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating category:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error updating category' },
      { status: 500 } // Internal server error
    );
  }
}

//get single category
export async function GET(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get the categoryId from the URL
    const categoryId = req.nextUrl.pathname.split('/')[4];

    // Step 3: Find the project by categoryId
    const category = await ProjectCategory.findById(categoryId);

    // Step 4: Check if the project was found
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 } // Not found
      );
    }

    // Step 5: Return the project as a response
    return NextResponse.json(
      { category },
      { status: 200 } // Success
    );
  } catch (error) {
    console.error('Error getting category:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error getting cateory' },
      { status: 500 } // Internal server error
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get the categoryId from the URL
    const categoryId = req.nextUrl.pathname.split('/')[4];

    // Step 3: Find the project by categoryId and delete it
    const deletedCategory = await ProjectCategory.findByIdAndDelete(categoryId);

    // Step 4: Check if the project was found and deleted
    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 } // Not found
      );
    }

    // Step 5: Return the deleted project as a response
    return NextResponse.json(
      { category: deletedCategory },
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