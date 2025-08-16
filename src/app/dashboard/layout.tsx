"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import FileuploadFab from "@/components/fileupload-fab";
import { Provider, uploadMethodAtom, useAtom } from "../store/index";

const videoConstraints = { facingMode: "environment" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const webcamRef = useRef<Webcam>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [uploading, setUploadmethod] = useAtom(uploadMethodAtom);

  const onUpload = useCallback(async (blob: Blob) => {
    try {
      setIsUploading(true);

      const res = await fetch(`/api/invoice/upload?filename=capture.jpg`, {
        method: "POST",
        body: blob,
      });

      const data = await res.json();
      console.log("Upload response:", data);
      alert("Upload complete!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
      setUploadmethod(null); // reset state after upload
    }
  }, [setUploadmethod]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => onUpload(blob));
    }
  }, [onUpload]);

  return (
    <Provider>
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
            {/* Camera Mode */}
            {uploading === "camera" && (
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
                  <Button onClick={() => setUploadmethod(null)} variant="secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Show Captured Preview */}
            {photo && uploading === "camera" && (
              <div className="flex flex-col items-center gap-4">
                <img src={photo} alt="Captured" className="rounded max-w-xs" />
                <Button onClick={() => setPhoto(null)} variant="secondary">
                  Retake
                </Button>
              </div>
            )}

            {/* Default children */}
            {uploading === null && children}

            <FileuploadFab />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
}