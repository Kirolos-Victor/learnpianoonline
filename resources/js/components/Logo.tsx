import { usePage } from '@inertiajs/react';
import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
    const { name } = usePage().props as any;
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    const textSizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Fun Piano Logo */}
            <div className={`${sizeClasses[size]} relative animate-bounce-gentle`}>
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full drop-shadow-lg">
                    {/* Piano body with fun gradient */}
                    <rect x="2" y="6" width="36" height="20" rx="4" fill="url(#pianoGradient)" stroke="#8B5CF6" strokeWidth="2" />

                    {/* White keys with fun colors */}
                    <rect x="4" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />
                    <rect x="9" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />
                    <rect x="14" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />
                    <rect x="19" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />
                    <rect x="24" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />
                    <rect x="29" y="10" width="4" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" rx="1" />

                    {/* Black keys with fun colors */}
                    <rect x="6" y="10" width="2.5" height="8" fill="#F97316" stroke="#EA580C" strokeWidth="1" rx="1" />
                    <rect x="11" y="10" width="2.5" height="8" fill="#EC4899" stroke="#DB2777" strokeWidth="1" rx="1" />
                    <rect x="21" y="10" width="2.5" height="8" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" rx="1" />
                    <rect x="26" y="10" width="2.5" height="8" fill="#22C55E" stroke="#16A34A" strokeWidth="1" rx="1" />

                    {/* Musical notes floating around */}
                    <circle cx="8" cy="4" r="1.5" fill="#F59E0B" className="animate-sparkle" />
                    <circle cx="32" cy="6" r="1" fill="#A855F7" className="animate-sparkle" />
                    <circle cx="6" cy="32" r="1.2" fill="#EF4444" className="animate-sparkle" />

                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="pianoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FEF3C7" />
                            <stop offset="50%" stopColor="#FDE68A" />
                            <stop offset="100%" stopColor="#FCD34D" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span
                        className={`font-fredoka ${textSizeClasses[size]} bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-4xl font-bold text-transparent`}
                    >
                        {name || 'iPiano'}
                    </span>
                    <span className="font-comic text-xs text-gray-600">Learn & Play! 🎵</span>
                </div>
            )}
        </div>
    );
};

export default Logo;
