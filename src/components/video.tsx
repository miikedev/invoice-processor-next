"use client"

import { useEffect, useState } from "react";

interface VideoProps {
  src: string;
}

export default function Video({ src }: VideoProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const videoHtml = `
      <video autoPlay muted loop playsInline class="w-full h-auto">
        <source src="${src}" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    `;
    setHtml(videoHtml);
  }, [src]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}