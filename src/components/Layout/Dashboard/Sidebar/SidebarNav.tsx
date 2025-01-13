'use client'
import {
  faAddressCard, faBarChart, faBell, faEnvelope, faFile, faFileLines, faIdCard, faMessage, faStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBuildingUser,
  faCalculator,
  faCheckCircle,
  faCheckDouble,
  faDollar,
  faGauge,
  faMoneyBill,
  faMoneyCheckDollar,
  faPeopleLine,
  faPeopleRoof,
  faPersonDress,
  faPersonShelter,
  faPlusCircle,
  faProjectDiagram,
  faPuzzlePiece,
  faSackDollar,
  faScaleUnbalancedFlip,
  faStarAndCrescent,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren, useEffect } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { siteData } from '@/constants/siteData'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/usePermissions'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

export default function SidebarNav() {
  const { user } = useAuth();
  const { isAdmin,
    isFinanceAdmin,
    canManageCMS,
    canManageProjects,
    canViewProjects,
    canApproveProjectBudget,
    isHRAdmin,
    canConfirmProjectCompletion,
    canManageProjectPayments,
    canViewClosedProjects,
    canManageInvoices,
    canManageExpenses,
    canManagePayroll,
    canManageEmployees
  } = usePermissions(user?.permissions || [], user?.role || '');

  useEffect(() => {
    console.log('current user is : ', user)
    console.log('isAdmin:', isAdmin())
    console.log("infianceadmin:", isFinanceAdmin())
  }, [user])

  return (
    <ul className="list-unstyled">

      {/* <SidebarNavItem icon={faGauge} href="/">
        {siteData.sidebar.items.dashboard}
      </SidebarNavItem> */}


      {
        (canManagePayroll() ||
          canManageExpenses() ||
          canManageInvoices() ||
          canApproveProjectBudget() ||
          canManageProjectPayments() ||
          canViewClosedProjects()
        ) && <>
          <SidebarNavTitle>Finance Management</SidebarNavTitle>

          {canManagePayroll() && <SidebarNavGroup toggleIcon={faDollar} toggleText={"Payroll"}>
            <SidebarNavItem icon={faMoneyBill} href="/payroll">Payroll</SidebarNavItem>
            <SidebarNavItem icon={faCalculator} href="/salary-calculator">Salary Calculator</SidebarNavItem>
            <SidebarNavItem icon={faPeopleLine} href="/">Attendance</SidebarNavItem>
          </SidebarNavGroup>
          }

          {canManageExpenses() && <SidebarNavGroup toggleIcon={faScaleUnbalancedFlip} toggleText={"Expense Tracker"}>
            <SidebarNavItem icon={faGauge} href="/expense-tracker">Office Expense Tracker</SidebarNavItem>
            <SidebarNavItem icon={faPuzzlePiece} href="/expense-categories">Expense Categories</SidebarNavItem>
          </SidebarNavGroup>}
          {canManageInvoices() && <SidebarNavGroup toggleIcon={faFile} toggleText={"Invoices"}>
            <SidebarNavItem icon={faFileLines} href="/invoices">See Invoices</SidebarNavItem>
            <SidebarNavItem icon={faPlusCircle} href="/generate-invoice">Generate Invoice</SidebarNavItem>
          </SidebarNavGroup>}

          {canApproveProjectBudget()
            && <SidebarNavItem icon={faSackDollar} href="/project-budget-approval">Project Budget</SidebarNavItem>}
          {canManageProjectPayments() && <SidebarNavItem icon={faMoneyCheckDollar} href="/project-payments">Project Payments</SidebarNavItem>}
          {canViewClosedProjects() && <SidebarNavItem icon={faCheckDouble} href="/closed-projects">Closed Projects</SidebarNavItem>}
        </>
      }

      {/* <SidebarNavItem icon={faBank} href="#">Cheques Management</SidebarNavItem> */}


      {
        (canManageEmployees()) && <>
          <SidebarNavTitle>Employees Management</SidebarNavTitle>
          <SidebarNavGroup toggleIcon={faPersonShelter} toggleText={"Employee"}>
            <SidebarNavItem icon={faPeopleRoof} href="/employee-profiles">Employee Profiles</SidebarNavItem>
            <SidebarNavItem icon={faPlusCircle} href="/add-employee">Add Employee</SidebarNavItem>
            <SidebarNavItem icon={faPeopleLine} href="/employees">Manage Employees</SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavItem icon={faStarAndCrescent} href="/employee-benefits">Employee Benefits</SidebarNavItem>
        </>
      }

      {(canViewProjects() && canManageProjects()) && <>
        <SidebarNavTitle>Project Management</SidebarNavTitle>
        <SidebarNavGroup toggleIcon={faProjectDiagram} toggleText={"Manage Projects"}>
          {(
            canViewProjects() ||
            canManageProjects()
          )
            && <SidebarNavItem icon={faFileLines} href="/manage-projects">See All Projects</SidebarNavItem>}
          {canManageProjects() && <SidebarNavItem icon={faPlusCircle} href="/manage-projects/new">Add New Project</SidebarNavItem>}
          {canConfirmProjectCompletion() && <SidebarNavItem icon={faCheckCircle} href="/project-completion-confirmation">Confirm Completion</SidebarNavItem>}
        </SidebarNavGroup>
        <SidebarNavItem icon={faCheckDouble} href="/closed-projects">Closed Projects</SidebarNavItem>
      </>
      }

      {
        canManageCMS() && <>
          <SidebarNavTitle>Website CMS</SidebarNavTitle>
          <SidebarNavGroup toggleIcon={faProjectDiagram} toggleText={"Projects"}>
            <SidebarNavItem icon={faFileLines} href="/projects">See Projects</SidebarNavItem>
            <SidebarNavItem icon={faPlusCircle} href="/projects/new">Add New Project</SidebarNavItem>
            <SidebarNavItem icon={faPuzzlePiece} href="/project-categories">Project Categories</SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavGroup toggleIcon={faPersonDress} toggleText={"Careers"}>
            <SidebarNavItem icon={faFileLines} href="/careers">Manage Careers</SidebarNavItem>
            <SidebarNavItem icon={faPlusCircle} href="/careers/applications">View Applications</SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavGroup toggleIcon={faUserTie} toggleText={"Clients"}>
            <SidebarNavItem icon={faFileLines} href="/cms/clients">See Clients</SidebarNavItem>
            <SidebarNavItem icon={faPlusCircle} href="/cms/clients/new">Add Clients</SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavItem icon={faMessage} href="/blogs">Blogs</SidebarNavItem>

        </>
      }


      {isAdmin() && (
        <>
          <SidebarNavTitle>Account Management</SidebarNavTitle>
          <SidebarNavItem icon={faPeopleRoof} href="/manage-accounts">Manage Accounts</SidebarNavItem>
          {/* <SidebarNavItem icon={faPlusCircle} href="/manage-accounts/new">Add New Account</SidebarNavItem> */}
        </>
      )}
      {
        isFinanceAdmin() && <>
          <SidebarNavTitle>Administration</SidebarNavTitle>
          <SidebarNavItem icon={faBuildingUser} href="#">Departments</SidebarNavItem>
          <SidebarNavItem icon={faBarChart} href="#">HR</SidebarNavItem>
          <SidebarNavItem icon={faEnvelope} href="#">Email Logs</SidebarNavItem>
          <SidebarNavItem icon={faIdCard} href="#">Etag and Card</SidebarNavItem>
        </>
      }

      {/* <SidebarNavItem icon={faCode} href="/pokemons">
        {siteData.sidebar.items.sample}
        <small className="ms-auto"><Badge bg="danger" className="ms-auto">DEMO</Badge></small>
      </SidebarNavItem> */}
    </ul>
  )
}
