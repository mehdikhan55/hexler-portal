export type Employee = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
    phoneNumber: string;
    dateOfBirth?: Date;
    hireDate: Date;
    position: string;
    status?: 'active' | 'inactive' | 'terminated';
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
    department?: string;
    salary: number;
    createdAt?: Date;
    updatedAt?: Date;
};
