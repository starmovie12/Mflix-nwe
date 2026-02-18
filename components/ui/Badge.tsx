interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'green' | 'gray';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variants = {
    default: 'bg-mflix-gray-500 text-mflix-gray-100',
    red: 'bg-mflix-red/90 text-white',
    green: 'bg-green-600/90 text-white',
    gray: 'bg-mflix-gray-600 text-mflix-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
