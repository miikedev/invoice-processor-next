"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { useAtom } from "jotai";
import { uploadMethodAtom } from "../store"; // Assuming this is your store path

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import FileuploadFab from "@/components/fileupload-fab";
import UploadForm from "@/components/upload-form";

const videoConstraints = { facingMode: "environment" };

// A new, dedicated component for the camera functionality
function CameraUploader() {
  const webcamRef = useRef<Webcam>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadMethod] = useAtom(uploadMethodAtom);

  // Step 1: Capture the photo from the webcam
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhotoSrc(imageSrc);
      // Convert the base64 image to a Blob for uploading
      fetch(imageSrc)
        .then((res) => res.blob())
        .then(setPhotoBlob);
    }
  }, [webcamRef]);

  // Step 2: Upload the captured photo
  const handleUpload = useCallback(async () => {
    if (!photoBlob) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/invoice/upload?filename=capture.jpg`, {
        method: "POST",
        body: photoBlob,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }
      
      const data = await res.json();
      console.log("Upload response:", data);
      alert("Upload complete!"); // Replace with a toast notification
      setUploadMethod(null); // Go back to the main view on success
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed."); // Replace with a toast notification
    } finally {
      setIsUploading(false);
    }
  }, [photoBlob, setUploadMethod]);
  
  const handleRetake = () => {
    setPhotoSrc(null);
    setPhotoBlob(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Show preview if a photo is taken, otherwise show the webcam */}
      {photoSrc ? (
        <>
          <Image src={photoSrc} alt="Captured" className="rounded max-w-xs" width={320} height={320} />
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
            <Button onClick={handleRetake} variant="secondary" disabled={isUploading}>
              Retake
            </Button>
          </div>
        </>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={320}
            videoConstraints={videoConstraints}
          />
          <Button onClick={handleCapture}>Take Photo</Button>
        </>
      )}
       <Button onClick={() => setUploadMethod(null)} variant="link" className="mt-4">
          Cancel
       </Button>
    </div>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [uploadMethod] = useAtom(uploadMethodAtom);

  return (
    // Provider is no longer needed here if your app has a root provider
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 relative">
          {uploadMethod === "file" && <UploadForm />}
          {uploadMethod === "camera" && <CameraUploader />}
          {uploadMethod === null && children}

          <FileuploadFab />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}