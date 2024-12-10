import { uploadToCloudinary } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import Employee from "@/models/employee";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
    try {
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
        let profilePhotoUrl = '/images/default-profile.jpg'; // Default image

        if (profilePhoto && profilePhoto instanceof File) {
            const fileBuffer = await profilePhoto.arrayBuffer();
            const mimeType = profilePhoto.type;
            const encoding = "base64";
            const base64Data = Buffer.from(fileBuffer).toString("base64");
            const fileUri = `data:${mimeType};${encoding},${base64Data}`;

            const uploadResponse = await uploadToCloudinary(fileUri, profilePhoto.name);

            if (!uploadResponse.success) {
                return NextResponse.json(
                    { message: 'Error uploading profile photo' }, 
                    { status: 500 }
                );
            }

            profilePhotoUrl = uploadResponse.result.secure_url;
        }

        // Create new employee object
        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            profilePhoto: profilePhotoUrl,
            phoneNumber,
            dateOfBirth: dateOfBirth === 'null' ? null : dateOfBirth,
            hireDate,
            position,
            status,
            salary,
            department: department === 'null' ? null : department,
            address: Object.values(address).every(v => v === null) ? null : address
        });

        // Save to MongoDB
        const savedEmployee = await newEmployee.save();

        // Return success response
        return NextResponse.json({
            message: 'Employee created successfully',
            employee: savedEmployee,
        });

    } catch (error) {
        console.error('Error adding employee:', error);
        return NextResponse.json({ message: 'Error adding employee' }, { status: 500 });
    }
}

export const revalidate = 0;