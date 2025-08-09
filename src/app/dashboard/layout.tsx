"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CameraIcon } from "lucide-react";

const videoConstraints = { facingMode: "environment" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const onUpload = useCallback(async (blob: Blob) => {
    console.log("Uploading photo blob...", blob);
    // Your upload logic here
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setIsCapturing(false);

      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          onUpload(blob);
        });
    }
  }, [onUpload]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between w-full gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          {!isCapturing && !photo && (
            <Button
              aria-label="Open camera"
              variant="secondary"
              size="icon"
              onClick={() => {
                setIsCapturing(true);
                setPhoto(null);
              }}
              className="p-3"
            >
              <CameraIcon size={24} />
            </Button>
          )}
        </header>

        <div className="flex flex-col flex-1 gap-4 p-4">
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
                <Button onClick={capture} variant="primary">
                  Take Photo
                </Button>
                <Button onClick={() => setIsCapturing(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {photo && (
            <div className="flex flex-col items-center gap-4">
              <img src={photo} alt="Captured" className="rounded" />
              <Button onClick={() => setPhoto(null)} variant="secondary">
                Retake
              </Button>
            </div>
          )}

          {!isCapturing && !photo && <>{children}</>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}