import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface ValidationRule {
  id: string;
  label: string;
  check: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    check: (password) => password.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter',
    check: (password) => /[a-z]/.test(password),
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    check: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'Contains number',
    check: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    label: 'Contains special character',
    check: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  return validationRules.filter((rule) => rule.check(password)).length;
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = getPasswordStrength(password);
  const strengthPercentage = (strength / validationRules.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return 'bg-red-500';
    if (strengthPercentage <= 40) return 'bg-orange-500';
    if (strengthPercentage <= 60) return 'bg-yellow-500';
    if (strengthPercentage <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthPercentage <= 20) return 'Very Weak';
    if (strengthPercentage <= 40) return 'Weak';
    if (strengthPercentage <= 60) return 'Fair';
    if (strengthPercentage <= 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">{getStrengthText()}</span>
      </div>
      <ul className="space-y-1">
        {validationRules.map((rule) => {
          const isValid = rule.check(password);
          return (
            <li
              key={rule.id}
              className={`text-sm flex items-center gap-1 ${
                isValid ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {isValid ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
