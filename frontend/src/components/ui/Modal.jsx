import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const sizeMap = {
  sm: 'max-w-[440px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[680px]',
  xl: 'max-w-[800px]',
};

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full overflow-hidden rounded-2xl bg-surface shadow-overlay',
          sizeMap[size] || sizeMap.md,
        )}
      >
        <div className="flex items-center justify-between border-b border-borderc px-4 py-3">
          <h2 className="text-[15px] font-semibold text-textc">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center rounded-md p-1 text-text2 transition hover:bg-surface2"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
