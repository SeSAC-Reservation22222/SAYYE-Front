"use client";

import { useState, useRef } from 'react';
import { compressImage, getFileSizeMB, createImagePreview } from '@/lib/utils/image';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  accept?: string;
  label?: string;
  error?: string;
}

export default function ImageUpload({
  onImageSelect,
  maxSizeMB = 5,
  maxWidthOrHeight = 1920,
  accept = 'image/*',
  label,
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      // 파일 크기 체크
      const fileSizeMB = getFileSizeMB(file);
      if (fileSizeMB > maxSizeMB) {
        setUploadError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다. (현재: ${fileSizeMB.toFixed(2)}MB)`);
        setUploading(false);
        return;
      }

      // 이미지 압축
      const compressedFile = await compressImage(file, {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthOrHeight,
      });

      // 미리보기 생성
      const previewUrl = await createImagePreview(compressedFile);
      setPreview(previewUrl);

      // 압축된 파일 전달
      onImageSelect(compressedFile);
    } catch (err) {
      console.error('이미지 처리 실패:', err);
      setUploadError('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      
      {preview ? (
        <div className="relative w-full">
          <div className="relative w-full max-w-md border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-auto"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              title="이미지 제거"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {uploading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              이미지 처리 중...
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              처리 중...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              이미지 선택
            </>
          )}
        </button>
      )}

      {(uploadError || error) && (
        <p className="text-sm text-red-500 mt-1">{uploadError || error}</p>
      )}
    </div>
  );
}
