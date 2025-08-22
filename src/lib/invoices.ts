// src/app/lib/invoices.ts

import { InvoiceData } from "@/components/invoice-data-table";
import { connectToDB } from "./db";
import { unstable_cache } from "next/cache";

export const getInvoice = unstable_cache(
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