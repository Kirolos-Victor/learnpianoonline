import Logo from '@/components/Logo';
import { Link } from '@inertiajs/react';
import { Music } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-navy text-cream">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="mb-4 inline-block">
                            <Logo className="text-cream" />
                        </Link>
                        <p className="text-cream/80 mb-4 max-w-md">
                            Master the piano from home with personalized 1-on-1 lessons, monthly curriculum, and expert feedback from professional
                            instructors.
                        </p>
                        <div className="text-teal flex items-center space-x-2">
                            <Music className="h-4 w-4" />
                            <span className="text-sm">Transform your musical journey</span>
                        </div>
                    </div>

                    {/* Quick as */}
                    <div>
                        <h3 className="font-playfair text-cream mb-4 text-lg font-semibold">Quick as</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/lessons" className="text-cream/80 hover:text-teal transition-colors">
                                    Lessons
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-cream/80 hover:text-teal transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-cream/80 hover:text-teal transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-cream/80 hover:text-teal transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-playfair text-cream mb-4 text-lg font-semibold">Contact</h3>
                        <ul className="text-cream/80 space-y-2">
                            <li>support@mypianoclass.net</li>
                            <li>1-800-PIANO-01</li>
                            <li>Available Mon-Fri 9AM-6PM</li>
                        </ul>
                    </div>
                </div>

                <div className="border-navy-600 text-cream/60 mt-8 border-t pt-8 text-center">
                    <p>&copy; 2024 mypianoclass.net. All rights reserved. Made with ♥ for piano enthusiasts.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
