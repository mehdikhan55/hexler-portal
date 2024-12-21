// /auth/login/page.tsx
import Link from 'next/link'
import LoginForm from './login'
import { SearchParams } from '@/types/next'

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="min-h-screen p-0 w-full">
      <LoginForm />
    </main>
  )
}