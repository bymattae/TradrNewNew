import React from 'react';

interface DefaultAvatarProps {
  className?: string;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="40" fill="#2A2A3C" />
      <circle cx="40" cy="32" r="12" fill="#4A4A6A" />
      <path
        d="M40 48C28.954 48 20 56.954 20 68V80H60V68C60 56.954 51.046 48 40 48Z"
        fill="#4A4A6A"
      />
    </svg>
  );
}; 