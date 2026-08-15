import { BIO_MAX_WORDS, countWords } from "../validation/author.validation";

interface BioFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export default function BioField({ value, onChange, onBlur, error }: BioFieldProps) {
  const wordCount = countWords(value);
  const isOverLimit = wordCount > BIO_MAX_WORDS;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor="author-bio" className="text-sm font-medium text-gray-700">
          Bio <span className="text-red-500">*</span>
        </label>
        <span
          className={`text-xs font-medium ${
            isOverLimit ? "text-red-600" : "text-gray-400"
          }`}
        >
          {wordCount} / {BIO_MAX_WORDS} words
        </span>
      </div>

      <textarea
        id="author-bio"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        rows={4}
        placeholder="A short biography for this author..."
        aria-invalid={Boolean(error) || isOverLimit}
        aria-describedby={error ? "author-bio-error" : undefined}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
          error || isOverLimit
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p id="author-bio-error" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
