// scripts/initAuth.js
import { User, Role, Permission } from '../models/user.js';
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";


async function initAuth() {
    try {
        try {
            // Attempt to connect to the database
            const db = await mongoose.connect('mongodb+srv://hexlertech:hexler-portal1122@hexler-portal-cluster.ni5cl.mongodb.net/hexlerTechPortal?retryWrites=true&w=majority&appName=hexler-portal-cluster', {});      
            console.log('Database connected successfully');
          } catch (error) {
            console.error('Database connection failed:', error);
            // Graceful exit in case of a connection error
            process.exit(1);
          }
        console.log('Connected to database');

        // Clear existing data
        await Permission.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing auth data');

        // Create Permissions
        const permissions = await Permission.insertMany([
            // Admin Permission
            { name: 'ADMIN', description: 'Full system access' },
            
            // Finance Permissions
            { name: 'VIEW_PAYROLL', description: 'View payroll records' },
            { name: 'MANAGE_PAYROLL', description: 'Manage payroll records' },
            { name: 'VIEW_EXPENSES', description: 'View expense records' },
            { name: 'MANAGE_EXPENSES', description: 'Manage expense records' },
            
            // HR Permissions
            { name: 'VIEW_EMPLOYEES', description: 'View employee records' },
            { name: 'MANAGE_EMPLOYEES', description: 'Manage employee records' },
            { name: 'MANAGE_BENEFITS', description: 'Manage employee benefits' },
            
            // CMS & Project Permissions
            { name: 'MANAGE_CMS', description: 'Manage website CMS' },
            { name: 'VIEW_PROJECTS', description: 'View project records' },
            { name: 'MANAGE_PROJECTS', description: 'Manage project records' }
        ]);

        // Helper function to get permission IDs by names
        const getPermissionIds = (permissionNames) => {
            return permissions
                .filter(p => permissionNames.includes(p.name))
                .map(p => p._id);
        };

        // Create Emp Role (Basic Employee)
        const empRole = await Role.create({
            name: 'Emp',
            permissions: getPermissionIds([
                'VIEW_PROJECTS'
            ])
        });

        // Create HR Role
        const hrRole = await Role.create({
            name: 'HR',
            permissions: getPermissionIds([
                'VIEW_EMPLOYEES',
                'MANAGE_EMPLOYEES',
                'MANAGE_BENEFITS'
            ])
        });

        // Create CTO Role
        const ctoRole = await Role.create({
            name: 'CTO',
            permissions: getPermissionIds([
                'MANAGE_CMS',
                'VIEW_PROJECTS',
                'MANAGE_PROJECTS'
            ]),
            subordinateRoles: [empRole._id]
        });

        // Create CFO Role
        const cfoRole = await Role.create({
            name: 'CFO',
            permissions: getPermissionIds([
                'VIEW_PAYROLL',
                'MANAGE_PAYROLL',
                'VIEW_EXPENSES',
                'MANAGE_EXPENSES',
                'VIEW_EMPLOYEES',
                'MANAGE_EMPLOYEES',
                'MANAGE_BENEFITS'
            ]),
            subordinateRoles: [hrRole._id]
        });

        // Create CEO Role (has ADMIN permission)
        const ceoRole = await Role.create({
            name: 'CEO',
            permissions: getPermissionIds(['ADMIN']), // CEO gets ADMIN permission
            subordinateRoles: [cfoRole._id, ctoRole._id]
        });

        // Create default users
        const defaultPassword = await bcrypt.hash('password123', 10);

        await User.insertMany([
            {
                email: 'ceo@hexlertech.com',
                password: defaultPassword,
                firstName: 'Saif',
                lastName: 'Orakzai',
                role: ceoRole._id,
                isActive: true
            },
            {
                email: 'cfo@hexlertech.com',
                password: defaultPassword,
                firstName: 'Jane',
                lastName: 'CFO',
                role: cfoRole._id,
                isActive: true
            },
            {
                email: 'cto@hexlertech.com',
                password: defaultPassword,
                firstName: 'Mike',
                lastName: 'CTO',
                role: ctoRole._id,
                isActive: true
            },
            {
                email: 'hr@hexlertech.com',
                password: defaultPassword,
                firstName: 'Sarah',
                lastName: 'HR',
                role: hrRole._id,
                isActive: true
            },
            {
                email: 'employee@hexlertech.com',
                password: defaultPassword,
                firstName: 'Bob',
                lastName: 'Employee',
                role: empRole._id,
                isActive: true
            }
        ]);

        // display inserted users with passwords below
        const users = await User.find({});
        console.log('Users created:', users.map(u => u));

        console.log('\nAuth initialization completed successfully!');
        console.log('\nDefault users created with password: password123');
        console.log('- CEO: ceo@hexlertech.com (Has ADMIN access)');
        console.log('- CFO: cfo@hexlertech.com');
        console.log('- CTO: cto@hexlertech.com');
        console.log('- HR: hr@hexlertech.com');
        console.log('- Employee: emp@hexlertech.com');

    } catch (error) {
        console.error('Error initializing auth:', error);
        throw error;
    }
}

await initAuth();

export default initAuth;