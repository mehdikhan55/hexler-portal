import { NextRequest, NextResponse } from "next/server";
import ProjectCategory from "@/models/projectCategory";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get all projects from the database, sorted by projectOrder
    const categories = await ProjectCategory.find();

    // Step 3: Return the projects as JSON response
    return NextResponse.json(
      { categories }, // Data to return in the response
      { status: 200 } // Optional status code (200 is default for success)
    );
  } catch (error) {
    console.error('Error getting categories:', error);

    // Return error response with appropriate message
    return NextResponse.json(
      { message: 'Error getting categories' },
      { status: 500 } // Internal server error
    );
  }
}

//post 
export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await dbConnect();

    // Step 2: Get the form data
    const formData = await req.json();

    // Step 3: Create a new project category
    const newCategory = new ProjectCategory(formData);

    // Step 4: Save the category to the database
    const savedCategory = await newCategory.save();

    // Step 5: Return the success response with the category data
    return NextResponse.json(
      { category: savedCategory,
        message: 'Category created successfully'
       },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('Error creating category:', error);

    // Return an error response if something went wrong
    return NextResponse.json(
      { message: 'Error creating category' },
      { status: 500 } // Internal server error
    );
  }
}

export const revalidate = 0;