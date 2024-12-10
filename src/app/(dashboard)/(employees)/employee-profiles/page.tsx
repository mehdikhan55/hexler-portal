'use client';
import React, { useEffect, useState } from 'react';
import Loader from "@/components/Common/Loader"
import { employeeServices } from '@/services/employeeServices';
import EmployeeCard from "@/components/Employee/EmployeeCard"

const Page = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    const result = await employeeServices.getEmployees();
    if (result.success) {
      setEmployees(result.data);
      console.log("Fetched employees", result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onDelete = async()=>{

  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">All Employees</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="p-2 flex flex-col gap-2">
              {employees.map((employee) => (
                <EmployeeCard fetchEmployees={fetchEmployees} key={employee._id} employee={employee} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
