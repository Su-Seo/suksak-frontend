import { ImagePlus, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export function DropZone({ onFilesAdded, disabled = false }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) {return;}
      const imageFiles = [...files].filter((f) => ACCEPTED_TYPES.has(f.type));
      if (imageFiles.length > 0) {onFilesAdded(imageFiles);}
    },
    [onFilesAdded, disabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {setIsDragging(true);}
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="사진 업로드 영역. 드래그하거나 클릭하세요."
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center gap-4',
        'rounded-2xl border-2 border-dashed p-8 sm:p-14 transition-all duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDragging
          ? 'scale-[1.01] border-primary bg-primary/5'
          : 'border-border hover:border-primary/40 hover:bg-muted/30',
        disabled && 'pointer-events-none opacity-50',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {inputRef.current?.click();}
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={[...ACCEPTED_TYPES].join(',')}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-200',
          isDragging ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {isDragging ? <ImagePlus size={30} /> : <Upload size={30} />}
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          {isDragging ? '여기에 놓으세요!' : isTouchDevice ? '탭하여 사진 선택' : '사진을 드래그하거나 클릭하여 선택'}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          JPEG · PNG · WebP · HEIC 지원 &nbsp;·&nbsp; 여러 파일 동시 처리 가능
        </p>
      </div>
    </div>
  );
}
