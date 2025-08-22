import InvoiceDataTable, { InvoiceData } from "@/components/invoice-data-table";
import { connectToDB } from "@/db/connect";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

const getInvoice = unstable_cache(
  async (userId: string, date: string) => {
    console.log('user id in get invoice', userId)
    console.log('date in get invoice', date)
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

const Invoice = async ({date}: {date: string}) => {
  const { userId } = await auth();
  // ✅ call the cached function with userId
  const data = await getInvoice(userId!, date);
  
  if (!data) {
    return <p className="text-gray-500">No invoices found.</p>;
  }
  
  return <InvoiceDataTable data={data} />;
};

export default Invoice