import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import UserNavbarDropdown from '@/components/user-navbar-dropdown';
import { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CreditCard, Home, Menu, MessageCircle, Music, Star, Users, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { post } = useForm();
    const logout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    // Student navigation items with kid-friendly labels
    const studentNavItems = [
        { name: 'dashboard.index', label: 'My Piano Home', icon: Home },
        { name: 'lessons.index', label: 'Piano Lessons', icon: Music },
        { name: 'student.index', label: 'My Students', icon: Users },
        { name: 'user.subscription', label: 'My Plan', icon: CreditCard },
        { name: 'contact.index', label: 'Get Help', icon: MessageCircle },
    ];

    // Instructor navigation items
    const instructorNavItems = [
        { name: 'instructor.dashboard', label: 'Dashboard', icon: Home },
        { name: 'instructor.students', label: 'My Students', icon: Users },
    ];

    // Admin navigation items
    const adminNavItems = [
        { name: 'admin.dashboard', label: 'Dashboard', icon: Home },
        { name: 'admin.users', label: 'Users', icon: Users },
    ];

    // Guest navigation items with kid-friendly labels
    const guestNavItems = [
        { name: 'home.index', label: 'Home', icon: Home },
        { name: 'pricing.index', label: 'Plans & Pricing', icon: Star },
        { name: 'contact.index', label: 'Contact Us', icon: MessageCircle },
    ];

    // Get navigation items based on user role
    const getNavItems = () => {
        if (!auth.user) return guestNavItems;

        if (auth.user.role === 'admin') {
            return adminNavItems;
        }

        if (auth.user.role === 'instructor') {
            return instructorNavItems;
        }

        return studentNavItems;
    };

    const navItems = getNavItems();
    const isActive = (path: string) => route().current() === path;

    return (
        <nav className="bg-rainbow-gradient shadow-fun border-b-4 border-fun-purple">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo with subtle hover animation */}
                    <Link href={route('home.index')} className="group">
                        <div className="transition-transform duration-200 hover:scale-105">
                            <Logo className="text-white drop-shadow-lg" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    {auth.user ? (
                        <>
                            <div className="hidden items-center space-x-4 md:flex">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.name)}
                                            className={`group flex items-center space-x-2 rounded-full px-4 py-3 font-comic text-lg transition-all duration-200 hover:scale-105 ${
                                                isActive(item.name) ? 'shadow-float bg-white text-fun-purple' : 'text-white hover:bg-white/20'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="hidden items-center space-x-4 md:flex">
                                <UserNavbarDropdown user={auth.user}></UserNavbarDropdown>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="hidden items-center space-x-4 md:flex">
                                {guestNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.name)}
                                            className={`group flex items-center space-x-2 rounded-full px-4 py-3 font-comic text-lg transition-all duration-200 hover:scale-105 ${
                                                isActive(item.name) ? 'shadow-float bg-white text-fun-purple' : 'text-white hover:bg-white/20'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="hidden items-center space-x-4 md:flex">
                                <Link href={route('login')}>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="rounded-full bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-fun-purple"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button
                                        size="lg"
                                        className="shadow-float rounded-full bg-fun-green px-8 py-3 font-comic text-lg text-white transition-all duration-200 hover:scale-105 hover:bg-fun-green-600"
                                    >
                                        🎹 Start Learning Piano!
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="rounded-full bg-white/20 p-3 text-white transition-all duration-200 hover:bg-white hover:text-fun-purple md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="rounded-b-3xl border-t-2 border-white/20 bg-white/10 py-6 backdrop-blur-sm md:hidden">
                        <div className="flex flex-col space-y-4">
                            {auth.user ? (
                                <>
                                    <div className="flex items-center space-x-3 rounded-2xl bg-white/20 p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fun-purple font-comic text-xl text-white">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-comic text-lg text-white">{auth.user.name}</span>
                                            <div className="font-comic text-sm text-white/80 capitalize">{auth.user.role}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={route(item.name)}
                                                    className={`flex items-center space-x-3 rounded-2xl px-4 py-3 font-comic text-lg transition-all duration-200 ${
                                                        isActive(item.name) ? 'bg-white text-fun-purple' : 'text-white hover:bg-white/20'
                                                    }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={logout}
                                            className="w-full rounded-2xl bg-fun-red px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:bg-fun-red-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {guestNavItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={route(item.name)}
                                                    className={`flex items-center space-x-3 rounded-2xl px-4 py-3 font-comic text-lg transition-all duration-200 ${
                                                        isActive(item.name) ? 'bg-white text-fun-purple' : 'text-white hover:bg-white/20'
                                                    }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-3 pt-4">
                                        <Link href={route('login')}>
                                            <Button
                                                variant="ghost"
                                                className="w-full rounded-2xl bg-white/20 px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:bg-white hover:text-fun-purple"
                                            >
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button className="w-full rounded-2xl bg-fun-green px-6 py-3 font-comic text-lg text-white transition-all duration-200 hover:bg-fun-green-600">
                                                🎹 Start Learning Piano!
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
