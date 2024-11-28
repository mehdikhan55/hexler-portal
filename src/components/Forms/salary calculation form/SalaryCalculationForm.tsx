'use client'
import React, { useState } from 'react';
import FormError from './FormError';
import { Alert, Form as SForm, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

const SalaryCalculationForm: React.FC = () => {
  const [name, setName] = useState<number | string>('');
  const [totalSalary, setTotalSalary] = useState<number | string>('');
  const [totalHours, setTotalHours] = useState<number | string>('');
  const [workedHours, setWorkedHours] = useState<number | string>('');
  const [hourlyRate, setHourlyRate] = useState<number | string>('');
  const [calculatedSalary, setCalculatedSalary] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const salary = Number(totalSalary);
    const hoursBound = Number(totalHours);
    const hoursWorked = Number(workedHours);

    if (salary <= 0 || hoursBound <= 0 || hoursWorked < 0) {
      setError("Please enter valid positive numbers.");
      setCalculatedSalary(null);
      return;
    }

    const hourlyRate = salary / hoursBound;
    const result = hourlyRate * hoursWorked;
    setHourlyRate(hourlyRate);
    setCalculatedSalary(result);
    setError(null);
  };

  return (
    <SForm noValidate onSubmit={handleSubmit}>
      <FormGroup className="mb-3">
        <FormLabel>Name</FormLabel>
        <FormControl
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup className="mb-3">
        <FormLabel>Total Salary</FormLabel>
        <FormControl
          type="number"
          value={totalSalary}
          onChange={(e) => setTotalSalary(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Hours Bound to Work</FormLabel>
        <FormControl
          type="number"
          value={totalHours}
          onChange={(e) => setTotalHours(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup className="mb-3">
        <FormLabel>Hours Worked</FormLabel>
        <FormControl
          type="number"
          value={workedHours}
          onChange={(e) => setWorkedHours(e.target.value)}
          required
        />
      </FormGroup>

      <Button className='m-1' type="submit" variant="primary">Calculate Salary</Button>
      <Button type="reset" variant="secondary" onClick={() => {
        setTotalSalary('');
        setTotalHours('');
        setWorkedHours('');
        setCalculatedSalary(null);
        setError(null);
      }}>Reset</Button>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {calculatedSalary !== null && (
        <Alert variant="success" className="mt-3">
          Calculated Salary of "{name}": {calculatedSalary.toFixed(2)}
          <br />
          Hourly Rate: {hourlyRate}
        </Alert>
      )}
    </SForm>
  );
};

export default SalaryCalculationForm;