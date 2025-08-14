'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function OverviewPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
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

          setBlob(newBlob);
        }}
        className='flex flex-col gap-3 max-h-[20rem] w-96'
      >
        <Input name="file" ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required />
        <Button type="submit">Upload</Button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
          <Image src={blob.url} width={100} height={100} alt="uploaded image"/>
        </div>
      )}
    </>
  );
}