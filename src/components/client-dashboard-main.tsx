// app/dashboard/client-dashboard-main.tsx
"use client";

import FileuploadFab from "@/components/fileupload-fab";
import UploadForm from "@/components/upload-form";
import CameraUploader from "@/components/camera-uploader";
import { uploadMethodAtom, useAtom } from "@/app/store";

export default function ClientDashboardMain({ children, userId }: { children: React.ReactNode, userId: string }) {
  const [uploadMethod] = useAtom(uploadMethodAtom);
console.log('userid in client dashboard main', userId)
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0 relative">
      {uploadMethod === "file" && <UploadForm userId={userId} />}
      {uploadMethod === "camera" && <CameraUploader />}
      {uploadMethod === null && children}

      <FileuploadFab />
    </main>
  );
}