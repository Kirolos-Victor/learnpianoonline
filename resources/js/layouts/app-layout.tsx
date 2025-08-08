import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs: _breadcrumbs }: AppLayoutProps) => (
    <div className="flex min-h-screen flex-col">
        <Navbar></Navbar>
        <main className="flex-grow">
            {/* Kid-friendly visual separator */}
            <div className="h-1 bg-gradient-to-r from-fun-pink via-fun-purple to-fun-blue"></div>

            {/* Main content area */}
            <div className="relative">{children}</div>
        </main>
        <Footer></Footer>
    </div>
);
