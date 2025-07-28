import React from 'react';

interface StatusBadgeProps {
  status: 'سليم' | 'تنبيه' | 'عطل';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'سليم':
        return 'bg-green-500 text-white glow-green';
      case 'تنبيه':
        return 'bg-yellow-500 text-black glow-yellow';
      case 'عطل':
        return 'bg-red-500 text-white glow-red';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs font-bold',
    md: 'px-4 py-2 text-sm font-bold',
    lg: 'px-5 py-2 text-base font-bold'
  };

  return (
    <span className={`${getStatusStyles()} ${sizeClasses[size]} rounded-full transition-all duration-300`}>
      {status}
    </span>
  );
};

export default StatusBadge;