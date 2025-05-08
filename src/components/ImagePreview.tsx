"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ImagePreviewProps {
  file: File | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    //Free memory when component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) {
    return null;
  }
  return (
    <div className="mt-2 relative h-40 w-full max-w-md rounded-lg overflow-hidden">
      <Image
        src={preview}
        alt="Image preview"
        fill
        className="object-contain"
      />
    </div>
  );
};
export default ImagePreview;
