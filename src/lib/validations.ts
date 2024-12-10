import { z } from 'zod';

export const ProjectAddSchema = z.object({
    projectName: z.string().min(3, 'Project name must be at least 3 characters long'),
    projectTagline: z.string().min(3, 'Project tagline must be at least 3 characters long'),
    projectDescription: z.string(),
    projectCategory: z.string().min(3, 'Project category must be at least 3 characters long'),
    projectImage: z.any(),
    projectLink: z.string(),
    projectOrder: z.string().min(1, 'Project order must be at least 1 character long'),
});
export const ProjectEditSchema = z.object({
    projectName: z.string().min(3, 'Project name must be at least 3 characters long'),
    projectTagline: z.string().min(3, 'Project tagline must be at least 3 characters long'),
    projectDescription: z.string(),
    projectCategory: z.string().min(3, 'Project category must be at least 3 characters long'),
    projectImage: z.any(),
    updatedImage: z.any(),
    projectLink: z.string(),
    projectOrder: z.string().min(1, 'Project order must be at least 1 character long'),
});

export const EmployeeAddSchema = z.object({
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters long')
        .max(50, 'First name must not exceed 50 characters'),
    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters long')
        .max(50, 'Last name must not exceed 50 characters'),
    email: z.string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters long')
        .max(100, 'Email must not exceed 100 characters'),
    profilePhoto: z.any().optional(),
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits'),
    dateOfBirth: z.string().optional(),
    hireDate: z.string(),
    position: z.string()
        .min(2, 'Position must be at least 2 characters long')
        .max(100, 'Position must not exceed 100 characters'),
    status: z.enum(['active', 'inactive', 'terminated'])
        .default('active'),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional()
    }).optional(),
    department: z.string().optional(),
    salary: z.number()
        .min(0, 'Salary cannot be negative')
        .max(1000000, 'Salary seems unusually high')
});