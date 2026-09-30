import React, { useState, useRef, useId } from 'react';
import { UploadCloud, Link as LinkIcon, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';
import { Button } from './Button';
import { clsx } from 'clsx';

export interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'banner' | 'product' | 'auto';
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'product',
  helperText = 'Supported formats: PNG, JPG, WEBP, GIF, SVG (Max 10MB)',
  error,
  disabled = false,
  className = '',
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Sync internal urlInput when value changes externally
  React.useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Basic client validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are permitted (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await api.uploadImage(file);
      onChange(res.url);
      setUrlInput(res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUrlInput('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    setUploadError(null);
    onChange(trimmed);
  };

  // Aspect ratio styling
  const aspectClass = {
    square: 'aspect-square max-h-48',
    banner: 'aspect-[3/1] min-h-[140px]',
    product: 'aspect-[4/3] max-h-56',
    auto: 'min-h-[140px]',
  }[aspectRatio];

  const resolvedValue = resolveImageUrl(value);

  return (
    <div className={clsx('space-y-1.5 text-left', className)}>
      {/* Label & Tab switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={clsx(
              'px-2 py-0.5 rounded-md transition-all',
              tab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900',
            )}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={clsx(
              'px-2 py-0.5 rounded-md transition-all',
              tab === 'url'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900',
            )}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => handleFileChange(e.target.files)}
      />

      {/* Main Container */}
      {value ? (
        /* Image Preview Box */
        <div
          className={clsx(
            'relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 transition-all shadow-subtle',
            aspectClass,
          )}
        >
          <img
            src={resolvedValue}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback placeholder if image link is broken
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/600x400/f1f5f9/64748b?text=Image+Load+Error';
            }}
          />

          {/* Action overlay */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-semibold shadow hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          {/* Active status indicator */}
          <div className="absolute top-2 right-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Image Attached</span>
          </div>
        </div>
      ) : tab === 'upload' ? (
        /* Drag and Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5',
            isDragging
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50/80 bg-slate-50/40',
            disabled && 'opacity-60 cursor-not-allowed',
            aspectClass,
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Uploading your image...</p>
              <p className="text-[11px] text-slate-400">Please wait a moment</p>
            </div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-subtle flex items-center justify-center text-slate-500 group-hover:text-brand-600 group-hover:scale-105 transition-all">
                <UploadCloud className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG up to 10MB</p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Direct URL Input Mode */
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="https://example.com/images/photo.jpg"
                className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleApplyUrl}
              disabled={!urlInput.trim()}
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Helper text or Errors */}
      {uploadError ? (
        <p className="text-[11px] font-medium text-red-600">{uploadError}</p>
      ) : error ? (
        <p className="text-[11px] font-medium text-red-600">{error}</p>
      ) : (
        !value && helperText && <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
