// /api/manage-projects/[projectId]/approve-budget/route.ts
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectManagement";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { projectId: string } }
  ) {
    try {
      await dbConnect();
      const { updatedBudget } = await req.json();
  
      const updateData: any = {
        approvedByFinance: true,
        sendForApproval: false
      };
  
      // If a new budget is provided, update it
      if (updatedBudget) {
        updateData.budget = updatedBudget;
      }
  
      const project = await Project.findByIdAndUpdate(
        params.projectId,
        { $set: updateData },
        { new: true }
      );
  
      if (!project) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Budget approved successfully", project },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error approving project budget:", error);
      return NextResponse.json(
        { message: "Error approving project budget" },
        { status: 500 }
      );
    }
  }
  
  export const revalidate = 0;