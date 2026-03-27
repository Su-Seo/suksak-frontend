export type ExifCategory = 'location' | 'datetime' | 'device' | 'camera' | 'software' | 'other';

export interface ExifTag {
  key: string;
  label: string;
  value: string;
  category: ExifCategory;
}

export type FileStatus = 'processing' | 'done' | 'error';

export interface ProcessedFile {
  id: string;
  originalFile: File;
  previewUrl: string;
  cleanedBlob: Blob | null;
  exifTags: ExifTag[];
  status: FileStatus;
  error?: string;
}