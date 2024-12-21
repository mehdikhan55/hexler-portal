import { Container } from 'react-bootstrap'
import React from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-light p-0 min-vh-100 d-flex flex-row align-items-center w-full">
      <div className='p-0 dark:bg-gray-900 w-full'>
        {children}
      </div>
    </div>
  )
}
