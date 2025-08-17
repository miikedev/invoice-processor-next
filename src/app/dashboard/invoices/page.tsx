
import { DatePicker } from '@/components/date-picker';
import InvoiceDataTable from '@/components/invoice-data-table';
import { connectToDB } from '@/db/connect'
import { unstable_cache } from 'next/cache';
import React, { Suspense } from 'react'
import { InvoiceData } from '@/components/invoice-data-table';
import DataTableSkeleton from '@/components/data-table-skeleton';

const getInvoice = unstable_cache(
    async () => {
      const db = await connectToDB();
      return db.collection<InvoiceData>("vouchers").findOne({}, { sort: { _id: -1 } })
    },
    ['invoice'],
    {
      tags: ['invoice']
    }
  )


const Invoice = async () => {
  let data = await getInvoice()
  console.log('invoice data', data);
    if (!data) {
    return <p className="text-gray-500">No invoices found.</p>;
  }
  return (
    <InvoiceDataTable data={data} />
  )
}
const InvoicesPage = () => {
  return <>
    <div className='flex justify-end'>
      <DatePicker />
    </div>

    <Suspense fallback={<DataTableSkeleton />}>
      <Invoice />
    </Suspense>
  </>
}

export default InvoicesPage