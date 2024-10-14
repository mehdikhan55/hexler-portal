import {
  faAddressCard, faBell, faFileLines, faStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBank,
  faBug,
  faCalculator,
  faChartPie,
  faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faProjectDiagram,
  faPuzzlePiece,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'
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

      {/* <SidebarNavItem icon={faCode} href="/pokemons">
        {siteData.sidebar.items.sample}
        <small className="ms-auto"><Badge bg="danger" className="ms-auto">DEMO</Badge></small>
      </SidebarNavItem> */}
      
      <SidebarNavTitle>Finance Management</SidebarNavTitle>
      <SidebarNavItem icon={faGauge} href="/expense-tracker">Office Expense Tracker</SidebarNavItem>
      <SidebarNavItem icon={faCalculator} href="/salary-calculator">Salary Calculator</SidebarNavItem>
      <SidebarNavItem icon={faBank} href="#">Cheques Management</SidebarNavItem>

      <SidebarNavTitle>Project Management</SidebarNavTitle>
      <SidebarNavItem icon={faProjectDiagram} href="#">Projects</SidebarNavItem>

      {/* <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText={siteData.sidebar.items.base}>
        <SidebarNavItem href="#">{siteData.sidebar.items.accordion}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.breadcrumb}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.cards}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.carousel}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.collapse}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.list_group}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.navs}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.pagination}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.popovers}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.progress}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.scrollspy}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.spinners}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.tables}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.tabs}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.tooltips}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText={siteData.sidebar.items.buttons}>
        <SidebarNavItem href="#">{siteData.sidebar.items.buttons}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.buttons_group}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.dropdowns}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faChartPie} href="#">{siteData.sidebar.items.charts}</SidebarNavItem>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText={siteData.sidebar.items.forms}>
        <SidebarNavItem href="#">{siteData.sidebar.items.form_control}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.select}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.checks_and_radios}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.range}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.input_group}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.floating_labels}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.layout}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.validation}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faStar} toggleText={siteData.sidebar.items.icons}>
        <SidebarNavItem href="#">{siteData.sidebar.items.core_ui_icons}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.core_ui_icons_brand}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.core_ui_icons_flag}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faBell} toggleText={siteData.sidebar.items.notifications}>
        <SidebarNavItem href="#">{siteData.sidebar.items.alerts}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.badge}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.modals}</SidebarNavItem>
        <SidebarNavItem href="#">{siteData.sidebar.items.toasts}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faCalculator} href="#">
        {siteData.sidebar.items.widgets}
        <small className="ms-auto"><Badge bg="info">NEW</Badge></small>
      </SidebarNavItem>

      <SidebarNavTitle>{siteData.sidebar.items.extras}</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faStar} toggleText={siteData.sidebar.items.pages}>
        <SidebarNavItem icon={faRightToBracket} href="login">{siteData.sidebar.items.login}</SidebarNavItem>
        <SidebarNavItem icon={faAddressCard} href="register">{siteData.sidebar.items.register}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{siteData.sidebar.items.error404}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{siteData.sidebar.items.error500}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faFileLines} href="#">{siteData.sidebar.items.docs}</SidebarNavItem>
      <SidebarNavItem icon={faLayerGroup} href="https://coreui.io/pro/">{siteData.sidebar.items.try_core_ui_pro}</SidebarNavItem> */}
    </ul>
  )
}
