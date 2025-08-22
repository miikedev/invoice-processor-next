'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertInvoiceData } from '@/db/connect';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import DocSearchingAnimation from '@/components/doc-searching-animation';
import Video from '@/components/video';
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