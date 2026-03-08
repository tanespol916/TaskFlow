import { cn } from '../../lib/utils';

export default function Textarea({ className, label, error, style, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[13px] font-medium text-textc">{label}</label>}
      <textarea
        className={cn(
          'w-full resize-none rounded-lg border bg-surface px-3 py-2 text-sm text-textc outline-none transition placeholder:text-text2 focus:ring-4',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10'
            : 'border-borderc focus:border-primary focus:ring-indigo-500/15',
          className,
        )}
        style={style}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
