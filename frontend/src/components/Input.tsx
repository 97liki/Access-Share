import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const baseStyles =
      'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6';
    const defaultStyles = 'ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600';
    const errorStyles = 'ring-red-300 placeholder:text-red-300 focus:ring-red-500';
    const disabledStyles = 'bg-gray-50 text-gray-500 cursor-not-allowed';

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`${baseStyles} ${
              error ? errorStyles : defaultStyles
            } ${props.disabled ? disabledStyles : ''} ${className}`}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={`mt-2 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 