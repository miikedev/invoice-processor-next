'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
export default function OverviewPage() {

const router = useRouter()
  const handleOnClick = () => {
    router.push('/dashboard/invoices')
  }
  return (
    <>
      <h1>Overview</h1>
      <Button onClick={handleOnClick}>Navigate to Invoice</Button>
    </>
  );
}