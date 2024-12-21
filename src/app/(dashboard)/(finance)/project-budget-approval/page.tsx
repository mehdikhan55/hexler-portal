'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectManagementServices, Project } from '@/services/projectManagementServices';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from 'react-hot-toast';

interface Budget {
  amount: string;
  currency: 'USD' | 'PKR';
}

export default function ProjectBudgetApproval() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newBudget, setNewBudget] = useState<Budget>({ amount: '', currency: 'USD' });
  const [showBudgetDialog, setShowBudgetDialog] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async (): Promise<void> => {
    try {
      const result = await projectManagementServices.getProjectsPendingApproval();
      if (result.success) {
        setProjects(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch projects');
      }
    } catch (error) {
      toast.error('Error fetching pending projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBudgetEdit = (project: Project): void => {
    setSelectedProject(project);
    setNewBudget({ 
      amount: project.budget.amount?.toString() || 'N/A', 
      currency: project.budget.currency as 'USD' | 'PKR'
    });
    setShowBudgetDialog(true);
  };

  const handleApproveBudget = async (
    project: Project, 
    updatedBudget: { amount: number; currency: string; } | null = null
  ): Promise<void> => {
    try {
      setProcessing(true);
      const result = await projectManagementServices.approveProjectBudget(
        project._id as string,
        updatedBudget
      );

      if (result.success) {
        toast.success('Project budget approved successfully');
        await fetchPendingProjects();
        setShowBudgetDialog(false);
      } else {
        throw new Error(result.message || 'Failed to approve budget');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error approving budget';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateAndApprove = async (): Promise<void> => {
    if (!newBudget.amount || isNaN(Number(newBudget.amount))) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    const updatedBudget = {
      amount: Number(newBudget.amount),
      currency: newBudget.currency
    };

    if (selectedProject) {
      await handleApproveBudget(selectedProject, updatedBudget);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Project Budget Approvals</h1>
        <p className="text-gray-500">Review and approve project budgets</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-gray-500">No projects pending budget approval</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.projectName}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.projectDescription}
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-500">Pending Approval</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">
                      {project.budget.amount?.toLocaleString() || "N/A"} {project.budget.currency}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {project.modules.length} modules
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleApproveBudget(project)}
                      disabled={processing}
                    >
                      Approve Current
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleOpenBudgetEdit(project)}
                      disabled={processing}
                    >
                      Modify & Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project Budget</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Budget Amount</Label>
              <Input
                type="number"
                value={newBudget.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewBudget({ ...newBudget, amount: e.target.value })}
                placeholder="Enter new budget amount"
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={newBudget.currency}
                onValueChange={(value: 'USD' | 'PKR') => 
                  setNewBudget({ ...newBudget, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBudgetDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAndApprove}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Update & Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}