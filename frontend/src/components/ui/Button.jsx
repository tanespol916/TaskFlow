import { cn } from '../../lib/utils';

const sizeStyles = {
  sm: 'rounded-lg px-3 py-1.5 text-[13px]',
  md: 'rounded-lg px-4 py-2 text-[13px]',
  lg: 'rounded-xl px-5 py-2.5 text-[15px]',
  icon: 'rounded-lg p-2',
};

const variantStyles = {
  primary: 'border border-transparent bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-transparent bg-surface2 text-textc hover:bg-borderc',
  danger: 'border border-transparent bg-red-500 text-white hover:bg-red-600',
  ghost: 'border border-transparent bg-transparent text-text2 hover:bg-surface2',
  outline: 'border border-borderc bg-transparent text-textc hover:bg-surface2',
};

export default function Button({ variant = 'primary', size = 'md', className, style, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.primary,
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
