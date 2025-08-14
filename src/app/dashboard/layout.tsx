"use client"

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CameraIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const videoConstraints = { facingMode: "environment" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Upload blob to API
  const onUpload = useCallback(async (blob: Blob) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      // const res = await fetch("/api/extract-text", {
      //   method: "POST",
      //   body: formData,
      // });

      // const data = await res.json();
      // console.log("Upload response:", data);
      alert("Upload complete! Check console for server response.");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Take screenshot
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setIsCapturing(false);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => onUpload(blob));
    }
  }, [onUpload]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center justify-between gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 relative">
          {isCapturing && (
            <div className="flex flex-col items-center gap-4">
              <Webcam
                audio={false}
                height={320}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={videoConstraints}
              />
              <div className="flex gap-2">
                <Button onClick={capture} disabled={isUploading} variant="secondary">
                  {isUploading ? "Uploading..." : "Take Photo"}
                </Button>
                <Button onClick={() => setIsCapturing(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {photo && !isCapturing && (
            <div className="flex flex-col items-center gap-4">
              <img src={photo} alt="Captured" className="rounded max-w-xs" />
              <Button onClick={() => { setPhoto(null); setIsCapturing(true); }} variant="secondary">
                Retake
              </Button>
            </div>
          )}

          {!isCapturing && !photo && children}

          {/* Floating Camera Button */}
          {!isCapturing && (
            <Button
              className="absolute bottom-6 right-6 p-5 rounded-full"
              onClick={() => {
                setIsCapturing(true);
                setPhoto(null);
              }}
            >
              <CameraIcon />
            </Button>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}