import { ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { DropZone } from '@/components/DropZone';
import { FileCard } from '@/components/FileCard';
import { Button } from '@/components/ui/button';
import { readExifTags, stripExif } from '@/lib/exifUtils';
import type { ProcessedFile } from '@/models/exif';

async function processFile(
  file: File,
): Promise<Pick<ProcessedFile, 'cleanedBlob' | 'exifTags' | 'status' | 'error'>> {
  const [exifResult, stripResult] = await Promise.allSettled([
    readExifTags(file),
    stripExif(file),
  ]);

  return {
    cleanedBlob: stripResult.status === 'fulfilled' ? stripResult.value : null,
    exifTags: exifResult.status === 'fulfilled' ? exifResult.value : [],
    status: stripResult.status === 'fulfilled' ? 'done' : 'error',
    error:
      stripResult.status === 'rejected'
        ? String((stripResult.reason as Error).message)
        : undefined,
  };
}

export function HomePage() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    const pendingFiles: ProcessedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      cleanedBlob: null,
      exifTags: [],
      status: 'processing',
    }));

    setFiles((previous) => [...previous, ...pendingFiles]);

    await Promise.all(
      pendingFiles.map(async (pending) => {
        const result = await processFile(pending.originalFile);
        setFiles((previous) =>
          previous.map((f) => (f.id === pending.id ? { ...f, ...result } : f)),
        );
      }),
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((previous) => {
      const target = previous.find((f) => f.id === id);
      if (target?.previewUrl) {URL.revokeObjectURL(target.previewUrl);}
      return previous.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles((previous) => {
      for (const f of previous) {URL.revokeObjectURL(f.previewUrl);}
      return [];
    });
  }, []);

  const doneCount = files.filter((f) => f.status === 'done').length;
  const processingCount = files.filter((f) => f.status === 'processing').length;
  const sensitiveCount = files.filter((f) =>
    f.exifTags.some((t) => t.category === 'location'),
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-14">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-3xl bg-primary/10 ring-1 ring-primary/15">
              <ShieldCheck size={36} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">개인정보 슥삭</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            사진 속에 숨겨진 <span className="font-medium text-foreground">위치 정보</span>,{' '}
            <span className="font-medium text-foreground">촬영 일시</span>,{' '}
            <span className="font-medium text-foreground">기기 정보</span>를 모두 지우고
            <br />
            안전하게 공유하세요.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck size={11} />
            모든 처리는 브라우저 안에서만 이루어집니다. 파일이 서버로 전송되지 않습니다.
          </p>
        </header>

        {/* Drop Zone */}
        <DropZone onFilesAdded={handleFilesAdded} />

        {/* File List */}
        {files.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {processingCount > 0 ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    처리 중... ({processingCount}개 남음)
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {sensitiveCount > 0 ? (
                      <>
                        <ShieldOff size={14} className="text-red-500" />
                        <p className="text-sm font-medium text-foreground">
                          {sensitiveCount}개 파일에서 위치 정보 제거됨
                        </p>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} className="text-green-500" />
                        <p className="text-sm font-medium text-foreground">
                          {doneCount}개 파일 처리 완료
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="gap-1.5 text-muted-foreground"
              >
                <Trash2 size={13} />
                전체 삭제
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <FileCard key={file.id} file={file} onRemove={handleRemove} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
