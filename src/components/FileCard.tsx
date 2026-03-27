import { AlertCircle, CheckCircle2, Download, Loader2, Trash2 } from 'lucide-react';

import { ExifTagBadge } from '@/components/ExifTagBadge';
import { Button } from '@/components/ui/button';
import { downloadBlob, formatFileSize, getCleanFileName } from '@/lib/exifUtils';
import { cn } from '@/lib/utils';
import type { ProcessedFile } from '@/models/exif';

interface Props {
  file: ProcessedFile;
  onRemove: (id: string) => void;
}

export function FileCard({ file, onRemove }: Props) {
  const handleDownload = () => {
    if (!file.cleanedBlob) {return;}
    downloadBlob(file.cleanedBlob, getCleanFileName(file.originalFile.name));
  };

  return (
    <div
      className={cn(
        'flex gap-4 rounded-xl border bg-card p-4 transition-all duration-200',
        file.status === 'error' && 'border-destructive/40 bg-destructive/5',
        file.status === 'done' && 'border-green-500/25 dark:border-green-500/20',
        file.status === 'processing' && 'border-border',
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={file.previewUrl}
          alt={file.originalFile.name}
          className="h-full w-full object-cover"
        />
        {file.status === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
        )}
        {file.status === 'done' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/25">
            <CheckCircle2 size={22} className="text-green-500" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-card-foreground">
              {file.originalFile.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatFileSize(file.originalFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="shrink-0 cursor-pointer text-muted-foreground/50 transition-colors hover:text-destructive"
            aria-label={`${file.originalFile.name} 제거`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* EXIF Tags */}
        <div className="mt-2.5 min-h-[20px]">
          {file.status === 'processing' ? (
            <p className="text-xs text-muted-foreground/60">메타데이터 분석 중...</p>
          ) : file.exifTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {file.exifTags.map((tag) => (
                <ExifTagBadge key={tag.key} tag={tag} />
              ))}
            </div>
          ) : file.status === 'done' ? (
            <p className="text-xs text-muted-foreground/60">메타데이터 없음 (이미 깨끗한 파일)</p>
          ) : null}
        </div>

        {file.status === 'error' && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
            <AlertCircle size={12} />
            <span>{file.error ?? '처리 중 오류가 발생했습니다'}</span>
          </div>
        )}
      </div>

      {/* Download */}
      {file.status === 'done' && file.cleanedBlob && (
        <div className="flex shrink-0 items-center">
          <Button size="sm" onClick={handleDownload} className="gap-1.5">
            <Download size={14} />
            다운로드
          </Button>
        </div>
      )}
    </div>
  );
}
