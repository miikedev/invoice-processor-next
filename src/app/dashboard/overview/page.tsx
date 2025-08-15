'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function OverviewPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(
      `/api/invoice/upload?filename=${file.name}`,
      {
        method: 'POST',
        body: file,
      },
    );
    const newBlob = (await response.json()) as PutBlobResult;
    console.log('newBlob', newBlob)

    setBlob(newBlob);
  }
  const handleTest = () => {
    
  }
  return (
    <>
      <h1>Upload Your Avatar</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 max-h-[20rem] w-96'
      >
        <Input name="file" ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required />
        <Button type="submit">Upload</Button>
        <Button onClick={handleTest}>Test</Button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
          <Image src={blob.url} alt="uploaded image" width="450" height="450" />
        </div>
      )}
    </>
  );
}