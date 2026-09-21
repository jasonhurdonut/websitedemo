"use client";

import { useState, useRef, useCallback } from "react";

interface UploadZoneProps {
  onUpload: (base64: string, mediaType: string) => void;
}

function resizeImage(file: File, maxSize: number): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mediaType: "image/jpeg" });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setPreview(URL.createObjectURL(file));
      const { base64, mediaType } = await resizeImage(file, 1500);
      onUpload(base64, mediaType);
    },
    [onUpload]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
        dragOver
          ? "border-accent bg-accent/5"
          : "border-zinc-300 hover:border-accent hover:bg-zinc-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mx-auto max-h-64 rounded-lg"
        />
      ) : (
        <>
          <div className="text-4xl mb-4">📸</div>
          <p className="text-lg font-medium text-zinc-700">
            Drop your Instagram screenshot here
          </p>
          <p className="text-sm text-zinc-400 mt-2">or click to browse</p>
        </>
      )}
    </div>
  );
}
