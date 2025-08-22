"use client"
import DataTableSkeleton from '@/components/data-table-skeleton';
import { DatePicker } from '@/components/date-picker';
import InvoiceDataTable from '@/components/invoice-data-table';
import { Loader } from 'lucide-react';
import { useQueryState } from 'nuqs';

import React, { Suspense, useEffect, useState } from 'react'

const Page = () => {
const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date,] = useQueryState('date');
  console.log('current picking date in invoice page', date)
  useEffect(() => {
    // Example: Fetch from Next.js API route or external API
    fetch(`/api/invoice/get?date=${date}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData?.data[0].data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setLoading(false);
      });
  }, [date]);
  console.log(data)
  if (loading) return <div className='h-[50vh] w-full flex flex-col items-center justify-center'><Loader className='animate-spin' /></div>;
  return (
      <>
      <div className="flex justify-end">
        <DatePicker /> {/* You’ll want this to update ?date=YYYY-MM-DD */}
      </div>
      <Suspense fallback={
        // <div className='h-[50vh] w-full flex flex-col items-center justify-center'><Loader className='animate-spin' /></div>
        <DataTableSkeleton />
        }>
        {data.length < 1 && <div>No Invoice Found!</div>}

        {data.map((invoice, index) => <InvoiceDataTable key={index} data={invoice} />)}
      </Suspense>
    </>
  )
}

export default Page