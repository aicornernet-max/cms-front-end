import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadFieldProps {
  currentImageUrl?: string | null;
  onFileSelected: (file: File) => void;
  onRemove?: () => void;
}

export function ImageUploadField({
  currentImageUrl,
  onFileSelected,
  onRemove,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Cover"
              className="h-full w-full object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
            <ImagePlus className="h-6 w-6" />
            <span className="mt-1 text-xs">No image</span>
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          {currentImageUrl ? "Replace image" : "Upload image"}
        </button>
        <p className="mt-1.5 text-xs text-slate-500">PNG or JPG, up to 5MB.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
