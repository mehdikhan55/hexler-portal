import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import { siteData } from '@/constants/siteData'

export default async function Breadcrumb() {

  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {siteData.breadcrumb.home}
      </BreadcrumbItem>
      <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {siteData.breadcrumb.library}
      </BreadcrumbItem>
      <BreadcrumbItem active>{siteData.breadcrumb.data}</BreadcrumbItem>
    </BSBreadcrumb>
  )
}
