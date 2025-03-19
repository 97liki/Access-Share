import React from 'react';

interface PasswordStrengthIndicatorProps {
  password?: string;
  strength?: number;
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
    check: (password) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'Contains special character',
    check: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const getPasswordStrength = (password: string): number => {
  return validationRules.filter(rule => rule.check(password)).length;
};

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password, strength: providedStrength }) => {
  const strength = providedStrength !== undefined ? providedStrength : (password ? getPasswordStrength(password) : 0);
  
  const getStrengthColor = () => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthPercent = () => {
    return (strength / 5) * 100;
  };

  return (
    <div className="space-y-2">
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${getStrengthColor()}`}
          style={{ width: `${getStrengthPercent()}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Password strength: {getStrengthText()}</span>
      </div>
      {password && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Password requirements:</h4>
          <ul className="space-y-1 text-xs">
            {validationRules.map((rule) => (
              <li
                key={rule.id}
                className={`flex items-center ${
                  rule.check(password) ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2">
                  {rule.check(password) ? (
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {rule.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
