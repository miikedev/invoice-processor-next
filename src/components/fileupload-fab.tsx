"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMethodAtom, useAtom } from "@/app/store";

export default function FileuploadFab() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploadmethod] = useAtom(uploadMethodAtom);

  useEffect(() => {
    console.log("uploading", uploading);
  }, [uploading]);

  return (
    <div className="flex items-center justify-center absolute bottom-5 right-5">
      {/* Main File Button */}
      <Button
        onClick={() => {
          if (!open) setUploadmethod(null); // reset to null instead of ""
          setOpen(!open);
        }}
        className="rounded-full p-5 shadow-lg"
        variant="outline"
      >
        <File className="w-6 h-6" />
      </Button>

      {/* Animated Buttons */}
      <AnimatePresence>
        {open && (
          <>
            {/* Camera Button */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -70 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Button
                className="rounded-full p-5 shadow-lg"
                variant="outline"
                onClick={() => setUploadmethod("camera")}
              >
                <Camera className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* File Upload Button */}
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: -70 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Button
                className="rounded-full p-5 shadow-lg"
                variant="outline"
                onClick={() => setUploadmethod("file")}
              >
                <Upload className="w-5 h-5" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}