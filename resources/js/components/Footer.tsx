import Logo from '@/components/Logo';
import { Music } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-navy text-cream">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <a href="/" className="mb-4 inline-block">
                            <Logo className="text-cream" />
                        </a>
                        <p className="mb-4 max-w-md text-cream/80">
                            Master the piano from home with personalized 1-on-1 lessons, monthly curriculum, and expert feedback from professional
                            instructors.
                        </p>
                        <div className="flex items-center space-x-2 text-teal">
                            <Music className="h-4 w-4" />
                            <span className="text-sm">Transform your musical journey</span>
                        </div>
                    </div>

                    {/* Quick as */}
                    <div>
                        <h3 className="mb-4 font-playfair text-lg font-semibold text-cream">Quick as</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/lessons" className="text-cream/80 transition-colors hover:text-teal">
                                    Lessons
                                </a>
                            </li>
                            <li>
                                <a href="/pricing" className="text-cream/80 transition-colors hover:text-teal">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard" className="text-cream/80 transition-colors hover:text-teal">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-cream/80 transition-colors hover:text-teal">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 font-playfair text-lg font-semibold text-cream">Contact</h3>
                        <ul className="space-y-2 text-cream/80">
                            <li>support@mypianoclass.net</li>
                            <li>1-800-PIANO-01</li>
                            <li>Available Mon-Fri 9AM-6PM</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-navy-600 pt-8 text-center text-cream/60">
                    <p>&copy; 2024 mypianoclass.net. All rights reserved. Made with ♥ for piano enthusiasts.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
