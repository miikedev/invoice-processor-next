"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DasbhoardPage = () => {
  const router = useRouter()
  useEffect(() => 
    router.push('/dashboard/invoices')
  ,[])
  return (
    <div>
      <h1 className='font-bold text-xl'>Welcome to Invoice Dashboard</h1>
    </div>
  )
}

export default DasbhoardPage