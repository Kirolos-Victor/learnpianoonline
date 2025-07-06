import { Link, useForm } from '@inertiajs/react';
import { ChevronDownIcon, Crown, Home, LogOut, Users } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

type User = {
    name: string;
};

export default function UserNavbarDropdown({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { post } = useForm();

    const logout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('logout'));
    };
    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fun-purple to-fun-blue px-4 py-2 font-comic text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-fun-purple-600 hover:to-fun-blue-600 focus:ring-2 focus:ring-fun-purple/50 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                </span>
                <span className="hidden font-fredoka sm:inline">{user.name}</span>
                <ChevronDownIcon className={`h-4 w-4 text-white transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 z-20 mt-2 w-64 origin-top-right animate-fade-in rounded-2xl border-2 border-fun-purple/20 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none"
                >
                    <div className="p-2">
                        {/* Header */}
                        <div className="mb-2 border-b border-fun-purple/20 px-3 py-2">
                            <p className="font-fredoka text-lg font-bold text-fun-purple">👋 Hi {user.name}!</p>
                            <p className="font-comic text-sm text-gray-600">What would you like to do?</p>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                            <Link
                                href={route('parent.dashboard')}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 font-comic text-sm font-medium text-fun-purple transition-all duration-200 hover:scale-105 hover:bg-fun-purple/10"
                                onClick={() => setOpen(false)}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fun-green/20">
                                    <Home className="h-4 w-4 text-fun-green" />
                                </div>
                                <div>
                                    <div className="font-fredoka font-bold">🏠 My Home</div>
                                    <div className="text-xs text-gray-500">Go to main dashboard</div>
                                </div>
                            </Link>

                            <Link
                                href={route('parent.students')}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 font-comic text-sm font-medium text-fun-purple transition-all duration-200 hover:scale-105 hover:bg-fun-purple/10"
                                onClick={() => setOpen(false)}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fun-blue/20">
                                    <Users className="h-4 w-4 text-fun-blue" />
                                </div>
                                <div>
                                    <div className="font-fredoka font-bold">👨‍👩‍👧‍👦 My Students</div>
                                    <div className="text-xs text-gray-500">Manage student profiles</div>
                                </div>
                            </Link>

                            <Link
                                href={route('parent.subscription')}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 font-comic text-sm font-medium text-fun-purple transition-all duration-200 hover:scale-105 hover:bg-fun-purple/10"
                                onClick={() => setOpen(false)}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fun-pink/20">
                                    <Crown className="h-4 w-4 text-fun-pink" />
                                </div>
                                <div>
                                    <div className="font-fredoka font-bold">⭐ My Plans</div>
                                    <div className="text-xs text-gray-500">View subscription plans</div>
                                </div>
                            </Link>

                            <button
                                onClick={(e) => {
                                    logout(e);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 font-comic text-sm font-medium text-red-600 transition-all duration-200 hover:scale-105 hover:bg-red-50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                    <LogOut className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <div className="font-fredoka font-bold">👋 Logout</div>
                                    <div className="text-xs text-red-400">See you later!</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
