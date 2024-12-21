// scripts/clearAuth.js
import { User, Role, Permission } from '../models/user';
import mongoose from "mongoose";

async function clearAuth() {
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

    } catch (error) {
        console.error('Error initializing auth:', error);
        throw error;
    }
}

await clearAuth();

export default clearAuth;