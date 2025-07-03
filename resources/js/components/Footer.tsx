import Logo from '@/components/Logo';
import { Link } from '@inertiajs/react';
import { Heart, Music, Star } from 'lucide-react';

const Footer = () => {
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

                    {/* Quick Links - Kid-friendly */}
                    <div>
                        <h3 className="mb-6 flex items-center font-fredoka text-xl font-bold text-white">
                            <Star className="mr-2 h-5 w-5 text-fun-yellow" />
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/lessons"
                                    className="inline-block transform font-comic text-lg text-white/80 transition-colors duration-200 hover:scale-105 hover:text-fun-yellow"
                                >
                                    🎵 Piano Lessons
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pricing"
                                    className="inline-block transform font-comic text-lg text-white/80 transition-colors duration-200 hover:scale-105 hover:text-fun-yellow"
                                >
                                    ⭐ Plans & Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="inline-block transform font-comic text-lg text-white/80 transition-colors duration-200 hover:scale-105 hover:text-fun-yellow"
                                >
                                    🏠 My Piano Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="inline-block transform font-comic text-lg text-white/80 transition-colors duration-200 hover:scale-105 hover:text-fun-yellow"
                                >
                                    💬 Get Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info - Family-friendly */}
                    <div>
                        <h3 className="mb-6 flex items-center font-fredoka text-xl font-bold text-white">
                            <Music className="mr-2 h-5 w-5 text-fun-yellow" />
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-white/90">
                            <li className="font-comic text-lg">📧 hello@mypianoclass.net</li>
                            <li className="font-comic text-lg">📞 1-800-PIANO-FUN</li>
                            <li className="font-comic text-sm text-white/70">Available Mon-Fri 9AM-6PM</li>
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
