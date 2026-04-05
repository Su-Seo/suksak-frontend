import JSZip from 'jszip';
import exifr from 'exifr';

import type { ExifTag, ProcessedFile } from '@/models/exif';

function formatExposureTime(value: number): string {
  if (value >= 1) {return `${value}s`;}
  return `1/${Math.round(1 / value)}s`;
}

export async function readExifTags(file: File): Promise<ExifTag[]> {
  try {
    const parsed = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
      iptc: false,
      icc: false,
      xmp: false,
    });

    if (!parsed) {return [];}

    const tags: ExifTag[] = [];

    if (parsed.latitude !== undefined && parsed.longitude !== undefined) {
      tags.push({
        key: 'gps',
        label: 'GPS 위치',
        value: `${(parsed.latitude as number).toFixed(5)}°N, ${(parsed.longitude as number).toFixed(5)}°E`,
        category: 'location',
      });
    }

    if (parsed.GPSAltitude !== undefined) {
      tags.push({
        key: 'altitude',
        label: '고도',
        value: `${Math.round(parsed.GPSAltitude as number)}m`,
        category: 'location',
      });
    }

    const dateField =
      (parsed.DateTimeOriginal as Date | string | undefined) ??
      (parsed.DateTime as Date | string | undefined) ??
      (parsed.DateTimeDigitized as Date | string | undefined);

    if (dateField) {
      const dateStr =
        dateField instanceof Date
          ? dateField.toLocaleString('ko-KR')
          : String(dateField);
      tags.push({
        key: 'datetime',
        label: '촬영 일시',
        value: dateStr,
        category: 'datetime',
      });
    }

    if (parsed.Make !== undefined || parsed.Model !== undefined) {
      tags.push({
        key: 'device',
        label: '기기',
        value: [parsed.Make, parsed.Model].filter(Boolean).join(' '),
        category: 'device',
      });
    }

    if (parsed.LensModel !== undefined) {
      tags.push({
        key: 'lens',
        label: '렌즈',
        value: String(parsed.LensModel),
        category: 'camera',
      });
    }

    if (parsed.FocalLength !== undefined) {
      tags.push({
        key: 'focal',
        label: '초점거리',
        value: `${parsed.FocalLength as number}mm`,
        category: 'camera',
      });
    }

    if (parsed.FNumber !== undefined) {
      tags.push({
        key: 'fnumber',
        label: '조리개',
        value: `f/${parsed.FNumber as number}`,
        category: 'camera',
      });
    }

    if (parsed.ISO !== undefined) {
      tags.push({
        key: 'iso',
        label: 'ISO',
        value: String(parsed.ISO),
        category: 'camera',
      });
    }

    if (parsed.ExposureTime !== undefined) {
      tags.push({
        key: 'exposure',
        label: '노출 시간',
        value: formatExposureTime(parsed.ExposureTime as number),
        category: 'camera',
      });
    }

    if (parsed.Software !== undefined) {
      tags.push({
        key: 'software',
        label: '소프트웨어',
        value: String(parsed.Software).trim(),
        category: 'software',
      });
    }

    return tags;
  } catch {
    return [];
  }
}

export async function stripExif(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas를 사용할 수 없습니다'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const quality = mimeType === 'image/jpeg' ? 0.95 : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {resolve(blob);}
          else {reject(new Error('이미지 처리에 실패했습니다'));}
        },
        mimeType,
        quality,
      );
    });

    img.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러올 수 없습니다'));
    });

    img.src = url;
  });
}

export function getCleanFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  if (dotIndex === -1) {return `슥삭_${originalName}`;}
  const name = originalName.slice(0, dotIndex);
  const ext = originalName.slice(dotIndex);
  return `슥삭_${name}${ext}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {return `${bytes} B`;}
  if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`;}
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(files: ProcessedFile[]): Promise<void> {
  const doneFiles = files.filter((f) => f.status === 'done' && f.cleanedBlob);
  if (doneFiles.length === 0) {return;}

  const zip = new JSZip();
  for (const file of doneFiles) {
    zip.file(getCleanFileName(file.originalFile.name), file.cleanedBlob!);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, '슥삭_모음.zip');
}
