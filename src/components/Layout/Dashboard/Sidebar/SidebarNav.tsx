import {
  faAddressCard, faBarChart, faBell, faEnvelope, faFileLines, faIdCard, faStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBuildingUser,
  faCalculator,
  faDollar,
  faGauge,
  faMoneyBill,
  faPeopleLine,
  faPeopleRoof,
  faPersonShelter,
  faPlusCircle,
  faProjectDiagram,
  faPuzzlePiece,
  faScaleUnbalancedFlip,
  faStarAndCrescent,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { siteData } from '@/constants/siteData'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

export default async function SidebarNav() {

  return (
    <ul className="list-unstyled">

      <SidebarNavItem icon={faGauge} href="/">
        {siteData.sidebar.items.dashboard}
      </SidebarNavItem>



      <SidebarNavTitle>Finance Management</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faDollar} toggleText={"Payroll"}>
        <SidebarNavItem icon={faCalculator} href="/salary-calculator">Salary Calculator</SidebarNavItem>
        <SidebarNavItem icon={faMoneyBill} href="/">Payslips</SidebarNavItem>
        <SidebarNavItem icon={faPeopleLine} href="/">Attendance</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faScaleUnbalancedFlip} toggleText={"Expense Tracker"}>
        <SidebarNavItem icon={faGauge} href="/expense-tracker">Office Expense Tracker</SidebarNavItem>
        <SidebarNavItem icon={faPuzzlePiece} href="/expense-categories">Expense Categories</SidebarNavItem>
      </SidebarNavGroup>

      {/* <SidebarNavItem icon={faBank} href="#">Cheques Management</SidebarNavItem> */}



      <SidebarNavTitle>Employees Management</SidebarNavTitle>
      <SidebarNavGroup toggleIcon={faPersonShelter} toggleText={"Employee"}>
        <SidebarNavItem icon={faPeopleRoof} href="/employee-profiles">Employee Profiles</SidebarNavItem>
        <SidebarNavItem icon={faPlusCircle} href="/add-employee">Add Employee</SidebarNavItem>
        <SidebarNavItem icon={faPeopleLine} href="/employees">Manage Employees</SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavItem icon={faStarAndCrescent} href="/employee-benefits">Employee Benefits</SidebarNavItem>


      <SidebarNavTitle>Website CMS</SidebarNavTitle>
      <SidebarNavGroup toggleIcon={faProjectDiagram} toggleText={"Projects"}>
        <SidebarNavItem icon={faFileLines} href="/projects">See Projects</SidebarNavItem>
        <SidebarNavItem icon={faPlusCircle} href="/projects/new">Add New Project</SidebarNavItem>
        <SidebarNavItem icon={faPuzzlePiece} href="/project-categories">Project Categories</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>Administration</SidebarNavTitle>
      <SidebarNavItem icon={faBuildingUser} href="#">Departments</SidebarNavItem>
      <SidebarNavItem icon={faBarChart} href="#">HR</SidebarNavItem>
      <SidebarNavItem icon={faEnvelope} href="#">Email Logs</SidebarNavItem>
      <SidebarNavItem icon={faIdCard} href="#">Etag and Card</SidebarNavItem>

      {/* <SidebarNavItem icon={faCode} href="/pokemons">
        {siteData.sidebar.items.sample}
        <small className="ms-auto"><Badge bg="danger" className="ms-auto">DEMO</Badge></small>
      </SidebarNavItem> */}
    </ul>
  )
}
