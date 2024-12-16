export type Career = {
    _id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
export type AddCareer = {
    name: string;
    description?: string;
    isActive: boolean;
};

export type CareerApplication ={
    _id?: string;
    firstName: string;
    lastName: string;
    gender: "male" | "female" | "other";
    DOB: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    projectLinks?: string;
    linkedinProfile?: string;
    githubProfile?: string;
    career: string | Career;
    resume?: string;
    status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
    createdAt?: string;
    updatedAt?: string;
} 