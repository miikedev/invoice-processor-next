import { DatePicker } from '@/components/date-picker';
import InvoiceDataTable from '@/components/invoice-data-table';
import { getInvoiceData } from '@/db/connect'
import React from 'react'
const InvoicesPage = async () => {
    let data = await getInvoiceData();
    data = {
    ...data,
    _id: data._id.toString(),
    // created_at: data.created_at?.toISOString(),
  };
    return <>
    <div className='flex justify-end'>
    <DatePicker />
    </div>
    <InvoiceDataTable data={data} />
    </>
}

export default InvoicesPage