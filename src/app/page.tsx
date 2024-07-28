'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Home() {
  const router = useRouter()
  return (
    <button type="button" onClick={() => router.push('/login')}>
      Click here if you are not automatically redirected to the login page.
    </button>
  )
}