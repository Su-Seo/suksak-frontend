import { cn } from '@/lib/utils';
import type { ExifCategory, ExifTag } from '@/models/exif';

const CATEGORY_STYLES: Record<ExifCategory, string> = {
  location:
    'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400',
  datetime:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  device:
    'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
  camera:
    'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400',
  software:
    'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400',
  other:
    'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400',
};

const CATEGORY_ICONS: Record<ExifCategory, string> = {
  location: '📍',
  datetime: '🕐',
  device: '📱',
  camera: '📷',
  software: '💻',
  other: '🏷️',
};

interface Props {
  tag: ExifTag;
}

export function ExifTagBadge({ tag }: Props) {
  return (
    <span
      className={cn(
        'inline-flex max-w-[200px] items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        CATEGORY_STYLES[tag.category],
      )}
      title={`${tag.label}: ${tag.value}`}
    >
      <span aria-hidden="true">{CATEGORY_ICONS[tag.category]}</span>
      <span className="truncate">{tag.label}</span>
    </span>
  );
}
