import { Link, useForm } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
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
                className="focus:ring-navy-600 inline-flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                </span>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDownIcon className="size-5 text-gray-400" aria-hidden="true" />
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 z-20 mt-2 w-56 origin-top-right animate-fade-in rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                    <div className="py-1">
                        <Link href={route('dashboard.index')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <Link href={route('student.index')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                            Students
                        </Link>
                        <Link href={'/'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                            {'Settings'}
                        </Link>
                        <button
                            onClick={logout}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            {'Logout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
