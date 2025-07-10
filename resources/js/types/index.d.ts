import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    subscribePrice: string; // For backward compatibility
    monthlySubscribePrice: string;
    yearlySubscribePrice: string;
    discountPercentage: number;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'instructor' | 'admin' | 'parent';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PricingData {
    student_count: number;
    monthly_amount: number;
    yearly_amount: number;
    students: Array<{
        id: number;
        name: string;
    }>;
}

export interface AvailableStudent {
    id: number;
    name: string;
    slug: string;
    age: number;
    is_subscribed: boolean;
}

export interface SubscriptionPageProps {
    pricingData: PricingData[];
    availableStudents: AvailableStudent[];
    subscribedStudents?: Array<{
        id: number;
        name: string;
        age: number;
        is_subscribed: boolean;
        subscription_expires_at?: string;
        sessions_remaining: number;
    }>;
    isSingleStudent?: boolean;
    selectedStudentSlug?: string;
    [key: string]: unknown;
}
