// scripts/managePermissions.js
import mongoose from "mongoose";
import { Permission, Role } from '../models/user.js';

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://hexlertech:hexler-portal1122@hexler-portal-cluster.ni5cl.mongodb.net/hexlerTechPortal?retryWrites=true&w=majority&appName=hexler-portal-cluster', {});
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function addPermission(name, description) {
  try {
    // Check if permission already exists
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      console.log(`Permission "${name}" already exists.`);
      return;
    }

    // Create new permission
    const newPermission = await Permission.create({
      name,
      description
    });

    console.log(`Successfully added new permission:`);
    console.log(`Name: ${newPermission.name}`);
    console.log(`Description: ${newPermission.description}`);
    console.log(`ID: ${newPermission._id}`);

  } catch (error) {
    console.error(`Error adding permission "${name}":`, error);
    throw error;
  }
}

async function deletePermission(name) {
  try {
    // Find the permission
    const permission = await Permission.findOne({ name });
    
    if (!permission) {
      console.log(`Permission "${name}" not found.`);
      return;
    }

    // Check if any roles are using this permission
    const rolesUsingPermission = await Role.find({
      permissions: permission._id
    });

    if (rolesUsingPermission.length > 0) {
      console.log(`Cannot delete permission "${name}". It is being used by the following roles:`);
      rolesUsingPermission.forEach(role => {
        console.log(`- ${role.name}`);
      });
      return;
    }

    // Delete the permission
    await Permission.deleteOne({ _id: permission._id });
    console.log(`Successfully deleted permission "${name}"`);

  } catch (error) {
    console.error(`Error deleting permission "${name}":`, error);
    throw error;
  }
}

async function listAllPermissions() {
  try {
    const permissions = await Permission.find({});
    console.log('\nCurrent Permissions:');
    permissions.forEach(permission => {
      console.log(`- ${permission.name}: ${permission.description}`);
    });
  } catch (error) {
    console.error('Error listing permissions:', error);
    throw error;
  }
}

async function managePermissions() {
  try {
    await connectDB();

    // List current permissions before changes
    console.log('\nBefore changes:');
    await listAllPermissions();

    // Example usage: Add new permissions
    await addPermission(
      'APPROVE-PROJECT_BUDGET', 
      'Permission to approve project budgets'
    );
    
    // await addPermission(
    //   'MANAGE_REPORTS', 
    //   'Permission to manage and generate system reports'
    // );

    // Example usage: Delete a permission
    // await deletePermission('VIEW_REPORTS');

    // List permissions after changes
    console.log('\nAfter changes:');
    await listAllPermissions();

    console.log('\nPermission management completed successfully!');
    
  } catch (error) {
    console.error('Error in permission management:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
await managePermissions();

export { addPermission, deletePermission, listAllPermissions };