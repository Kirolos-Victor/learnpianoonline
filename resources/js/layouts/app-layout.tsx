import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children }: AppLayoutProps) => (
    <>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
    </>
);
