import { Card, CardBody, CardHeader } from 'react-bootstrap'
import SalaryCalculationForm from '@/components/Forms/salary calculation form/SalaryCalculationForm'


export default async function Page() {

  return (
    <Card>
      <CardHeader>Salary Calculator</CardHeader>
      <CardBody>
        <SalaryCalculationForm />
      </CardBody>
    </Card>
  )
}
