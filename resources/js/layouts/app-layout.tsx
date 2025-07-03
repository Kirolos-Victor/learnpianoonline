import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs }: AppLayoutProps) => (
    <div className="flex min-h-screen flex-col">
        <Navbar></Navbar>
        <main className="flex-grow">
            {/* Kid-friendly visual separator */}
            <div className="h-1 bg-gradient-to-r from-fun-pink via-fun-purple to-fun-blue"></div>

            {/* Main content area with subtle background pattern */}
            <div className="relative">
                {/* Subtle decorative elements for kids */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-pulse-gentle absolute top-10 left-10 h-4 w-4 rounded-full bg-fun-yellow opacity-20"></div>
                    <div
                        className="animate-pulse-gentle absolute top-20 right-20 h-3 w-3 rounded-full bg-fun-pink opacity-20"
                        style={{ animationDelay: '1s' }}
                    ></div>
                    <div
                        className="animate-pulse-gentle absolute top-40 left-1/4 h-2 w-2 rounded-full bg-fun-green opacity-20"
                        style={{ animationDelay: '2s' }}
                    ></div>
                    <div
                        className="animate-pulse-gentle absolute top-60 right-1/3 h-3 w-3 rounded-full bg-fun-blue opacity-20"
                        style={{ animationDelay: '0.5s' }}
                    ></div>
                </div>

                {children}
            </div>
        </main>
        <Footer></Footer>
    </div>
);
