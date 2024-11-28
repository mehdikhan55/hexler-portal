import {z} from 'zod';

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