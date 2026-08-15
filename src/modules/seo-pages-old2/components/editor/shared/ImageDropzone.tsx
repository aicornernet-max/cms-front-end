import { ImagePlus, Trash2 } from "lucide-react";
import { Label } from "./FormFields";
import { buttonSecondary } from "./styles";

interface ImageDropzoneProps {
  preview: string;
  onFile: (file: File | null) => void;
  onRemove: () => void;
}

export function ImageDropzone({ preview, onFile, onRemove }: ImageDropzoneProps) {
  return (
    <div>
      <Label text="Category image" />
      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed ${
          preview ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200 bg-slate-50"
        }`}
      >
        <input
          id="seo-category-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          <div className="flex flex-col gap-4 p-4 sm:flex-row">
            <img
              src={preview}
              alt="Category preview"
              className="h-36 w-36 rounded-xl object-cover shadow-sm"
            />
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-semibold">Category image ready</p>
              <p className="mt-1 text-xs text-slate-500">
                This preview updates immediately. Save the Basic Information section to
                upload it.
              </p>
              <div className="mt-3 flex gap-2">
                <label htmlFor="seo-category-image" className={buttonSecondary}>
                  Replace image
                </label>
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor="seo-category-image"
            className="flex cursor-pointer flex-col items-center justify-center px-6 py-10 text-center"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm">
              <ImagePlus className="h-6 w-6 text-indigo-600" />
            </span>
            <strong className="mt-3 text-sm">Upload category image</strong>
            <span className="mt-1 text-xs text-slate-400">
              PNG, JPG or WebP · click to browse
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
