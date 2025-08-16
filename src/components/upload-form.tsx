'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertInvoiceData } from '@/db/connect';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

export default function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    try {
      // First API call to upload the file and get data
      const uploadResponse = await fetch(`/api/invoice/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const { uploadedUrl, extractedData } = await uploadResponse.json();
      console.log('url', uploadedUrl);
      console.log('data', extractedData);
      setUrl(uploadedUrl);

      // Second API call to insert the extracted data into the database
      if (extractedData) {
        const createResponse = await fetch(`/api/invoice/create`, {
          method: 'POST',
          // 1. Set the correct header
          headers: {
            'Content-Type': 'application/json',
          },
          // 2. Stringify the JavaScript object
          body: JSON.stringify(extractedData),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to save invoice data');
        }

        const result = await createResponse.json();
        console.log('Invoice created successfully:', result);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // You could also set an error state here to show a message to the user
    }
  };

  const handleTest = async () => {
    const res = await fetch("/api/invoice/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "hello" }),
    });

    const data = await res.json();
    console.log("Test insert result:", data);
  };

  return (
    <>
      <h1>Upload Your Invoice Image</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 max-h-[20rem] w-96'
      >
        <Input name="file" ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required />
        <Button type="submit">Upload</Button>
        <Button type="button" onClick={handleTest}>Test</Button>
      </form>
      {url && (
        <div>
          Blob url: <Link href={url} target='_blank'>{url}</Link>
          <Image src={url} alt="uploaded image" width="450" height="450" />
        </div>
      )}
    </>
  );
}