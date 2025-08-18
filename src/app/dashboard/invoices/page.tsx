"use server"
import { DatePicker } from '@/components/date-picker';
import InvoiceDataTable from '@/components/invoice-data-table';
import { connectToDB } from '@/db/connect'
import { unstable_cache } from 'next/cache';
import React, { Suspense } from 'react'
import { InvoiceData } from '@/components/invoice-data-table';
import DataTableSkeleton from '@/components/data-table-skeleton';
import { auth } from '@clerk/nextjs/server';

const getInvoice = unstable_cache(
  async (userId: string) => {
    console.log('user id in get invoice', userId)
    const db = await connectToDB();
    const doc = await db
      .collection<InvoiceData>(`vouchers-${userId}`)
      .findOne({}, { sort: { _id: -1 } });

    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id.toString(),
      created_at: doc.created_at.toString(),
    };
  },
  ["invoice"],
  { tags: ["invoice"] }
);

const Invoice = async () => {
  const { userId } = await auth();
  console.log('userId in invoice', userId);

  // ✅ call the cached function with userId
  const data = await getInvoice(userId!);

  if (!data) {
    return <p className="text-gray-500">No invoices found.</p>;
  }
  
  return <InvoiceDataTable data={data} />;
};

const InvoicesPage = () => {
  return (
    <>
      <div className="flex justify-end">
        <DatePicker />
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <Invoice />
      </Suspense>
    </>
  );
};

export default InvoicesPage;