import { Invoice } from '@/app/models/Invoice';
import { connectToDB, insertInvoiceData } from '@/db/connect';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    console.log('hit the route');

    try {
        // 1. Parse the incoming JSON body from the request stream
        const invoiceData = await request.json();
        console.log('invoice data', invoiceData)
        // 2. Pass the parsed data to your database function
        const created = await insertInvoiceData({ ...invoiceData, created_at: Date.now })

        // Return a success response
        return NextResponse.json({ success: true, message: 'Invoice data saved.', data: created }, { status: 201 });

    } catch (error) {
        console.error("Failed to create invoice:", error);
        // Return an error response if something goes wrong
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}