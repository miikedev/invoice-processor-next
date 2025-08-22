import { Invoice } from '@/app/models/Invoice';
import { connectToDB, getAllInvoices, insertInvoiceData } from '@/db/connect';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    console.log('hit the route', date);
    const { userId } = await auth();
    const data = await getAllInvoices(userId!, new Date(date!))
    console.log('data', data)
    try {
        // Return a success response
        return NextResponse.json({ success: true, message: 'Invoice data retrieved.', data: [{ data, user_id: userId }] }, { status: 200 });
    } catch (error) {
        console.error("Failed to create invoice:", error);
        // Return an error response if something goes wrong
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}