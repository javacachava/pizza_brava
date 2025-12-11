import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => {
  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    outline:   'border border-gray-400 text-gray-700 hover:bg-gray-100',
    danger:    'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`px-4 py-2 rounded-md transition-all ${variants[variant]} ${className}`}
    >
      {loading ? 'Cargando…' : children}
    </button>
  );
};
