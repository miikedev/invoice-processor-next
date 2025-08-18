import { genai } from '@/utils/genai';
import { processInvoiceTest } from '@/utils/procecss-invoice';
import { put, PutBlobResult } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `capture-${Date.now()}.jpg`;


    // Upload blob directly from request.body
    const blob: PutBlobResult = await put(`invoices/${filename}`, request.body!, {
        access: 'public',   
        addRandomSuffix: true,
    });

    if (!blob.url) {
        return NextResponse.json(
            { error: 'Failed to upload blob' },
            { status: 500 }
        );
    }

    console.log('✅ Blob uploaded:', blob);

    const ocrText = await processInvoiceTest(blob.url);
    const extractedData = await genai(ocrText);

    return NextResponse.json({
        uploadedUrl: blob.url,
        extractedData,
    });
}