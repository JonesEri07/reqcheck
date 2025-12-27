"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ChallengeImageUploadProps {
  imageUrl?: string | null;
  imageFile?: File | null;
  imageAltText?: string | null;
  onImageChange: (url: string | null) => void;
  onImageFileChange: (file: File | null) => void;
  onAltTextChange: (altText: string | null) => void;
  skillId: string;
  questionId?: string;
}

export function ChallengeImageUpload({
  imageUrl,
  imageFile,
  imageAltText,
  onImageChange,
  onImageFileChange,
  onAltTextChange,
  skillId,
  questionId,
}: ChallengeImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview URL from file when file changes
  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  // Use preview URL if available, otherwise use imageUrl (for existing images)
  const displayUrl = previewUrl || imageUrl;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${validTypes.join(", ")}`);
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File size exceeds 2MB limit");
      return;
    }

    setError(null);

    // Stage the file locally (don't upload yet)
    onImageFileChange(file);
    onImageChange(null); // Clear any existing uploaded URL
  };

  const handleRemove = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageFileChange(null);
    onImageChange(null);
    onAltTextChange(null);
    setError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question Image (Optional)</Label>
        <p className="text-sm text-muted-foreground">
          Add an image to accompany your question. Max size: 2MB
        </p>
      </div>

      {displayUrl ? (
        <div className="space-y-3">
          <div className="relative w-full rounded-lg border overflow-hidden bg-muted">
            <Image
              src={displayUrl}
              alt={imageAltText || "Question image"}
              width={800}
              height={400}
              className="w-full h-auto object-contain max-h-64"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-alt-text">Image Alt Text</Label>
            <Input
              id="image-alt-text"
              placeholder="Describe the image for accessibility"
              value={imageAltText || ""}
              onChange={(e) => onAltTextChange(e.target.value || null)}
            />
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Choose image file
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
