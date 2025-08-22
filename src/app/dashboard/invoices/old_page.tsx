// app/invoices/page.tsx (example path)

import { DatePicker } from '@/components/date-picker';
import InvoiceDataTable, { InvoiceData } from '@/components/invoice-data-table';
import { connectToDB } from '@/db/connect';
import { unstable_cache } from 'next/cache';
import React, { Suspense } from 'react';
import DataTableSkeleton from '@/components/data-table-skeleton';
import { auth } from '@clerk/nextjs/server';
import { loadSearchParams } from '@/lib/search-params';


// app/invoices/page.tsx (updated function)

const getInvoiceByDate = unstable_cache(
  async (userId: string, date?: Date) => {
    const db = await connectToDB();
    console.log('date in get invoice by date', date)
    let filter = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);

      filter = { created_at: { $gte: startDate, $lte: endDate } };
    } else {
      filter = { created_at: { $gte: (new Date()).setHours(0,0,0,0), $lte: (new Date()).setHours(23, 59, 59, 999)} }
    }



    // FIX: Use find() and toArray() to get all matching documents
    const documents = await db
      .collection<InvoiceData>(`vouchers-${userId}`)
      .find(filter, { sort: { _id: -1 } })
      .toArray();

    if (!documents || documents.length === 0) return [];

    // FIX: Map over the array to transform each document
    return documents.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      created_at: doc.created_at.toString(),
    }));
  },
  ['invoices-by-date'], // Changed cache key to be more descriptive
  { tags: ['invoice'] }
);
const Invoice = async ({ date }: { date?: Date }) => { // Allow date to be optional
  
  const { userId } = await auth();
  if (!userId) return <p>Please login</p>;

  // data will now be an array
  const data = await getInvoiceByDate(userId, date);
  console.log('date in invoice', date)
  // FIX: Check if the array is empty
  if (!data || data.length < 1) {
    const displayDate = date ? new Date(date).toLocaleDateString() : 'the latest day';
    return <p className="text-gray-500">No invoices found for {displayDate}.</p>;
  }

  return <>
    {
      data.map((invoice, index) => <InvoiceDataTable key={invoice._id} data={invoice} />)
    }
  </>;
};


export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {

  const params = await loadSearchParams(searchParams)

  console.log('date in invoice page', params)
  return (
    <>
      <div className="flex justify-end">
        <DatePicker /> {/* You’ll want this to update ?date=YYYY-MM-DD */}
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <Invoice date={params.date} />
      </Suspense>
    </>
  );
}