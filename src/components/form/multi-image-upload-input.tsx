import * as React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';

export interface MultiImageUploadInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value?: File[];
  onChange?: (value: File[]) => void;
  maxFiles?: number;
  maxSizeMb: number;
  label: string;
}

const MultiImageUploadInput = React.forwardRef<HTMLInputElement, MultiImageUploadInputProps>(
  (
    { className, value = [], onChange, maxFiles = 3, disabled, maxSizeMb, label, ...props },
    ref,
  ) => {
    const maxSize = maxSizeMb * 1024 * 1024;
    const [previews, setPreviews] = React.useState<string[]>([]);
    const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

    React.useEffect(() => {
      const urls = value.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [value]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) {
        return;
      }

      if (Array.from(files).find((f) => f.size > maxSize)) {
        toast.error(t('common.validationErrors.imageMaxSize', { maxSize: maxSizeMb }));
        return;
      }

      const validFiles = Array.from(files).filter(
        (f) => ['image/png', 'image/jpeg', 'image/jpg'].includes(f.type) && f.size <= maxSize,
      );

      const updated = [...(value || []), ...validFiles].slice(0, maxFiles);
      onChange?.(updated);
      e.target.value = '';
    };

    const handleRemove = (index: number) => {
      const updated = value.filter((_, i) => i !== index);
      onChange?.(updated);
    };

    return (
      <div className="flex gap-4 flex-wrap">
        {previews.map((src, i) => (
          <div
            key={i}
            className={cn(
              'relative w-[72px] h-[72px] border rounded-md overflow-hidden group',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <img src={src} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute inset-0 flex items-center justify-center 
                         bg-black/40 text-white opacity-0 group-hover:opacity-100 
                         transition-opacity text-3xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {value.length < maxFiles && !disabled && (
          <label
            className={cn(
              'w-[72px] h-[72px] flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors',
              className,
            )}
          >
            <input
              ref={ref}
              type="file"
              accept="image/png,image/jpeg"
              multiple
              disabled={disabled}
              onChange={handleSelect}
              {...props}
              className="hidden"
            />
            <span className="text-sm text-center">{label}</span>
          </label>
        )}
      </div>
    );
  },
);

MultiImageUploadInput.displayName = 'MultiImageUploadInput';
export { MultiImageUploadInput };
