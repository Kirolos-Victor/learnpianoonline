import Logo from '@/components/Logo';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CreditCard, Heart, Home, MessageCircle, Music, Star } from 'lucide-react';
import { route } from 'ziggy-js';

const Footer = () => {
    const { auth, supportEmail, supportPhone } = usePage<SharedData>().props;

    // Check if we're on a student page
    const isStudentPage = () => {
        return window.location.pathname.includes('/student/');
    };

    // Get navigation items based on user role
    const getQuickLinks = () => {
        if (!auth.user) {
            // Guest navigation items
            return [
                { name: 'home.index', label: 'Home', icon: Home },
                { name: 'about.index', label: 'About Us', icon: Star },
                { name: 'blog.index', label: 'Piano Tips', icon: BookOpen },
                { name: 'pricing.index', label: 'Pricing', icon: CreditCard },
                { name: 'contact.index', label: 'Contact Us', icon: MessageCircle },
            ];
        }

        if (auth.user.role === 'parent') {
            // For parent role, check if we're on a student page
            if (isStudentPage()) {
                return [
                    { name: 'student.dashboard', label: 'My Piano Home', icon: '🏠' },
                    { name: 'student.sessions', label: 'Sessions', icon: '🎵' },
                ];
            }
            return [
                { name: 'parent.dashboard', label: 'My Piano Home', icon: '🏠' },
                { name: 'parent.students', label: 'My Students', icon: '👥' },
                { name: 'parent.subscription', label: 'My Plan', icon: '💳' },
                { name: 'parent.contact', label: 'Get Help', icon: '💬' },
            ];
        }

        if (auth.user.role === 'instructor') {
            return [
                { name: 'instructor.dashboard', label: 'Dashboard', icon: '🏠' },
                { name: 'instructor.students', label: 'My Students', icon: '👥' },
            ];
        }

        if (auth.user.role === 'admin') {
            return [
                { name: 'admin.dashboard', label: 'Dashboard', icon: '🏠' },
                { name: 'admin.parents', label: 'Parents', icon: '👥' },
            ];
        }

        // Default to guest links
        return [
            { name: 'home.index', label: 'Home', icon: '🏠' },
            { name: 'pricing.index', label: 'Plans & Pricing', icon: '⭐' },
            { name: 'contact.index', label: 'Contact Us', icon: '💬' },
        ];
    };

    const quickLinks = getQuickLinks();

    return (
        <footer className="relative overflow-hidden bg-fun-purple text-white">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-4 left-10 text-xl text-white/10">♪</div>
                <div className="absolute top-8 right-20 text-lg text-white/10">♫</div>
                <div className="absolute bottom-4 left-1/4 text-xl text-white/10">♪</div>
                <div className="absolute right-1/3 bottom-8 text-lg text-white/10">♫</div>
            </div>

            <div className="relative container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="mb-6 inline-block">
                            <Logo className="text-white" />
                        </Link>
                        <p className="mb-6 max-w-md font-comic text-lg leading-relaxed text-white/90">
                            🎹 Where young musicians discover the joy of piano! Personalized 1-on-1 lessons, fun curriculum, and expert teachers who
                            make learning piano exciting for kids aged 5+.
                        </p>
                        <div className="flex items-center space-x-3 text-fun-yellow">
                            <Heart className="h-5 w-5" />
                            <span className="font-comic text-lg">Making music magical for kids!</span>
                            <Heart className="h-5 w-5" />
                        </div>
                    </div>

                    {/* Quick Links - Role-based */}
                    <div>
                        <h3 className="mb-6 flex items-center font-fredoka text-xl font-bold text-white">
                            <Star className="mr-2 h-5 w-5 text-fun-yellow" />
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => {
                                // For student interface, we need to handle the route differently
                                const getHref = () => {
                                    if (isStudentPage() && link.name === 'student.dashboard') {
                                        // Get current student slug from URL
                                        const studentSlug = window.location.pathname.split('/student/')[1]?.split('/')[0];
                                        return route('student.dashboard', { student: studentSlug });
                                    }
                                    if (isStudentPage() && link.name === 'student.sessions') {
                                        // Get current student slug from URL
                                        const studentSlug = window.location.pathname.split('/student/')[1]?.split('/')[0];
                                        return route('student.sessions', { student: studentSlug });
                                    }
                                    return route(link.name);
                                };

                                return (
                                    <li key={link.name}>
                                        <Link
                                            href={getHref()}
                                            className="inline-block transform font-comic text-lg text-white/80 transition-colors duration-200 hover:scale-105 hover:text-fun-yellow"
                                        >
                                            {typeof link.icon === 'string' ? link.icon : <link.icon className="inline h-4 w-4" />} {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Contact Info - Family-friendly */}
                    <div>
                        <h3 className="mb-6 flex items-center font-fredoka text-xl font-bold text-white">
                            <Music className="mr-2 h-5 w-5 text-fun-yellow" />
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-white/90">
                            <li className="font-comic text-lg">📧 {supportEmail}</li>
                            <li className="font-comic text-lg">📞 {supportPhone}</li>
                            <li className="font-comic text-sm text-white/70">Response within 48 hours</li>
                            <li className="font-comic text-sm text-white/70">🌟 We love helping young musicians!</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 border-t border-white/20 pt-8 text-center text-white/80">
                    <div className="font-comic text-lg">
                        <p className="mb-2">&copy; 2024 MyPianoClass.net - Where Piano Dreams Come True!</p>
                        <p className="text-sm">Made with 💖 for young musicians and their families</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
