import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className,
}) => {
    return (
        <div className={cn('text-center py-12', className)}>
            {icon && <div className="mx-auto h-12 w-12 text-gray-400 mb-4">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-gray-500 mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
};
