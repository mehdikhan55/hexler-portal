import { NextRequest, NextResponse } from "next/server";
import Employee from "@/models/employee"
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/lib/storage";

export async function PUT(req: NextRequest) {
    try {
        // Step 1: Connect to the database
        await dbConnect();

        // Get form data
        const formData = await req.formData();

        // Handle required fields
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const hireDate = formData.get('hireDate') as string;
        const position = formData.get('position') as string;
        const status = formData.get('status') as string;
        const salary = parseFloat(formData.get('salary') as string);

        // Handle optional fields
        const dateOfBirth = formData.get('dateOfBirth');
        const department = formData.get('department');

        // Handle address object
        const address = {
            street: formData.get('address[street]'),
            city: formData.get('address[city]'),
            state: formData.get('address[state]'),
            zip: formData.get('address[zip]')
        };
        // Clean up address object - remove 'null' strings
        Object.keys(address).forEach(key => {
            // @ts-ignore
            if (address[key] === 'null') {
                // @ts-ignore
                address[key] = null;
            }
        });

        // Handle profile photo upload
        const profilePhoto = formData.get('profilePhoto') as File;
        const updatedImage = formData.get('updatedImage') as File;



        const employeeId = req.nextUrl.pathname.split('/')[3]

        if (!employeeId || !formData) {
            return NextResponse.json(
                { message: "Missing employeeId or updatedData" },
                { status: 400 } // Bad request
            );
        }


        let updatedData;

        //@ts-ignore
        if (profilePhoto === "null" && updatedImage !== "null") {
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
                firstName,
                lastName,
                email,
                phoneNumber,
                hireDate,
                position,
                status,
                salary,
                dateOfBirth,
                department: (department === "null") ? null : department,
                address,
                profilePhoto: imageUrl
            };
        }
        //@ts-ignore
        else if (profilePhoto === "null" && updatedImage === "null") {
            // if no new image is uploaded and previous image is removed
            updatedData = {
                firstName,
                lastName,
                email,
                phoneNumber,
                hireDate,
                position,
                status,
                salary,
                dateOfBirth,
                department: (department === "null") ? null : department,
                address,
                profilePhoto: "/images/default-profile.jpg"
            };
            //@ts-ignore
        } else if (profilePhoto !== "null" && updatedImage === "null") {
            // if no new image is uploaded
            console.log('heelo')
            updatedData = {
                firstName,
                lastName,
                email,
                phoneNumber,
                hireDate,
                position,
                status,
                salary,
                dateOfBirth,
                department: (department === "null") ? null : department,
                address,
                profilePhoto: profilePhoto
            };
        }

        console.log("updatedData", updatedData);
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updatedData },
            { new: true }
        );

        if (!updatedEmployee) {
            return NextResponse.json(
                { message: "Employee not found" },
                { status: 404 }
            );
        }
        console.log("updatedEmployee", updatedEmployee);
        return NextResponse.json(
            { employee: updatedEmployee },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating employee:', error);

        // Return an error response if something went wrong
        return NextResponse.json(
            { message: 'Error updating employee' },
            { status: 500 } // Internal server error
        );
    }
}

//get single Employee
export async function GET(req: NextRequest) {
    try {
        // Step 1: Connect to the database
        await dbConnect();

        const employeeId = req.nextUrl.pathname.split('/')[3];

        const employee = await Employee.findById(employeeId).populate("department");

        if (!employee) {
            return NextResponse.json(
                { message: "Employee not found" },
                { status: 404 } // Not found
            );
        }

        // Step 5: Return the employee as a response
        return NextResponse.json(
            { employee },
            { status: 200 } // Success
        );
    } catch (error) {
        console.error('Error getting employee:', error);

        // Return an error response if something went wrong
        return NextResponse.json(
            { message: 'Error getting employee' },
            { status: 500 } // Internal server error
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Step 1: Connect to the database
        await dbConnect();

        const employeeId = req.nextUrl.pathname.split('/')[3];

        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return NextResponse.json(
                { message: "Employee not found" },
                { status: 404 } // Not found
            );
        }

        return NextResponse.json(
            { employee: deletedEmployee },
            { status: 200 } // Success
        );
    } catch (error) {
        console.error('Error deleting employee:', error);

        // Return an error response if something went wrong
        return NextResponse.json(
            { message: 'Error deleting employee' },
            { status: 500 } // Internal server error
        );
    }
}

export const revalidate = 0;