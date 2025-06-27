import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import UserNavbarDropdown from '@/components/user-navbar-dropdown';
import { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Menu, X, Music, Users, Star, MessageCircle, Home, BookOpen, Calendar, Settings, CreditCard } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const { post } = useForm();
    const logout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    // Student navigation items
    const studentNavItems = [
        { name: 'dashboard.index', label: 'Home', icon: Home },
        { name: 'lessons.index', label: 'Lessons', icon: Music },
        { name: 'student.index', label: 'Students', icon: Users },
        { name: 'user.subscription', label: 'Subscriptions', icon: CreditCard },
        { name: 'contact.index', label: 'Contact', icon: MessageCircle }
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

    // Guest navigation items
    const guestNavItems = [
        { name: 'home.index', label: 'Home', icon: Home },
        { name: 'pricing.index', label: 'Pricing', icon: Star },
        { name: 'contact.index', label: 'Contact', icon: MessageCircle }
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
        <nav className="bg-rainbow-gradient border-b-4 border-fun-purple shadow-fun">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href={route('home.index')} className="animate-bounce-gentle">
                        <Logo className="text-white drop-shadow-lg" />
                    </Link>

                    {/* Desktop Navigation */}
                    {auth.user ? (
                        <>
                            <div className="hidden items-center space-x-6 md:flex">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.name)}
                                            className={`group flex items-center space-x-2 rounded-full px-4 py-3 text-lg font-comic transition-all duration-300 hover:scale-110 ${
                                                isActive(item.name)
                                                    ? 'bg-white text-fun-purple shadow-float'
                                                    : 'text-white hover:bg-white/20'
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
                            <div className="hidden items-center space-x-6 md:flex">
                                {guestNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.name)}
                                            className={`group flex items-center space-x-2 rounded-full px-4 py-3 text-lg font-comic transition-all duration-300 hover:scale-110 ${
                                                isActive(item.name)
                                                    ? 'bg-white text-fun-purple shadow-float'
                                                    : 'text-white hover:bg-white/20'
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
                                        className="rounded-full bg-white/20 text-white hover:bg-white hover:text-fun-purple font-comic text-lg px-6 py-3 transition-all duration-300 hover:scale-105"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button
                                        size="lg"
                                        className="rounded-full bg-fun-green text-white hover:bg-fun-green-600 font-comic text-lg px-8 py-3 shadow-float transition-all duration-300 hover:scale-105 animate-bounce-gentle"
                                    >
                                        🎹 Start Learning!
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="rounded-full bg-white/20 p-3 text-white hover:bg-white hover:text-fun-purple transition-all duration-300 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="border-t-2 border-white/20 bg-white/10 backdrop-blur-sm py-6 md:hidden rounded-b-3xl">
                        <div className="flex flex-col space-y-4">
                            {auth.user ? (
                                <>
                                    <div className="flex items-center space-x-3 p-4 bg-white/20 rounded-2xl">
                                        <div className="w-12 h-12 bg-fun-purple rounded-full flex items-center justify-center text-white font-comic text-xl">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="text-white font-comic text-lg">{auth.user.name}</span>
                                            <div className="text-white/80 text-sm font-comic capitalize">
                                                {auth.user.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={route(item.name)}
                                                    className={`flex items-center space-x-3 rounded-2xl px-4 py-3 text-lg font-comic transition-all duration-300 ${
                                                        isActive(item.name)
                                                            ? 'bg-white text-fun-purple'
                                                            : 'text-white hover:bg-white/20'
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
                                            className="w-full rounded-2xl bg-fun-red text-white font-comic text-lg px-6 py-3 hover:bg-fun-red-600 transition-all duration-300"
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
                                                    className={`flex items-center space-x-3 rounded-2xl px-4 py-3 text-lg font-comic transition-all duration-300 ${
                                                        isActive(item.name)
                                                            ? 'bg-white text-fun-purple'
                                                            : 'text-white hover:bg-white/20'
                                                    }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-col space-y-3 pt-4">
                                        <Link href={route('login')} onClick={() => setIsOpen(false)}>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                className="w-full rounded-2xl bg-white/20 text-white hover:bg-white hover:text-fun-purple font-comic text-lg py-3"
                                            >
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href={route('register')} onClick={() => setIsOpen(false)}>
                                            <Button
                                                size="lg"
                                                className="w-full rounded-2xl bg-fun-green text-white hover:bg-fun-green-600 font-comic text-lg py-3 animate-bounce-gentle"
                                            >
                                                🎹 Start Learning!
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
