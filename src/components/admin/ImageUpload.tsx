'use client'

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const { language } = useLanguageStore();

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-surface-card border border-border-primary shadow-sm">
            <div className="z-10 absolute top-2 right-2">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 text-white p-1 rounded-sm shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              sizes="200px"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="kalsuq_preset" options={{ multiple: true }}>
        {({ open }) => {
          const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            open();
          };

          return (
            <button
              type="button"
              disabled={false}
              onClick={onClick}
              className={cn(
                "flex items-center gap-2 bg-surface-card border border-border-primary text-text-primary px-4 py-3 text-sm font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-300",
                language === 'am' && "font-ethiopic tracking-normal text-sm"
              )}
            >
              <UploadCloud className="h-5 w-5" />
              {language === 'en' ? 'Upload an Image' : 'ምስል ይጫኑ'}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
