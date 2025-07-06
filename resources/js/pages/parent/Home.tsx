import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ParentLayout from '@/layouts/parent-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CreditCard, Heart, MessageSquare, Plus, Star, Users } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
    slug: string;
    age: number;
    hasPiano: boolean;
    isSubscribed: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    subscriptionEndDate?: string;
    sessionsRemaining: number;
    instructor?: {
        id: string;
        name: string;
    };
}

interface ParentHomeSharedData extends SharedData {
    students: Student[];
}

const ParentHome = () => {
    const { auth, students } = usePage<ParentHomeSharedData>().props;
    const [loading, setLoading] = useState(false);

    return (
        <ParentLayout>
            <div className="min-h-screen bg-background">
                <Head title={'Parent Dashboard'}></Head>

                {/* Kid-friendly Header */}
                <div className="bg-rainbow-gradient relative overflow-hidden px-6 py-12">
                    {/* Decorative musical notes */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="animate-gentle-bounce absolute top-4 left-1/4 text-2xl text-white/20">♪</div>
                        <div className="animate-gentle-bounce absolute top-8 right-1/3 text-xl text-white/20" style={{ animationDelay: '0.5s' }}>
                            ♫
                        </div>
                        <div className="animate-gentle-bounce absolute bottom-4 left-1/3 text-2xl text-white/20" style={{ animationDelay: '1s' }}>
                            ♪
                        </div>
                        <div className="animate-gentle-bounce absolute right-1/4 bottom-8 text-xl text-white/20" style={{ animationDelay: '1.5s' }}>
                            ♫
                        </div>
                    </div>

                    <div className="relative container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="text-center md:text-left">
                                <h1 className="mb-4 font-fredoka text-4xl font-bold text-white md:text-5xl">🎹 Welcome back, {auth.user.name}!</h1>
                                <p className="mb-2 font-comic text-xl text-white/90">Manage your young pianist's learning journey! 🎵</p>
                                <div className="flex items-center justify-center space-x-2 text-white/80 md:justify-start">
                                    <Star className="h-5 w-5" />
                                    <span className="font-comic">Parent Dashboard</span>
                                    <Star className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    {loading ? (
                        <div className="mx-auto max-w-4xl">
                            <Card className="bg-fun-gradient rounded-3xl border-fun-purple/20">
                                <CardContent className="flex items-center justify-center py-16">
                                    <div className="text-center">
                                        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-fun-purple border-b-transparent"></div>
                                        <p className="font-comic text-lg text-fun-purple">Loading your piano world... 🎹</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : students.length === 0 ? (
                        /* No Students - Kid-friendly Prompt */
                        <div className="mx-auto max-w-3xl">
                            <Card className="shadow-fun rounded-3xl border-fun-pink/30 bg-gradient-to-br from-fun-pink/10 to-fun-purple/10">
                                <CardHeader className="pb-6 text-center">
                                    <div className="animate-gentle-bounce mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-pink">
                                        <Users className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="mb-3 font-fredoka text-3xl text-fun-purple">
                                        🎹 Let's Start Your Child's Piano Adventure! 🌟
                                    </CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-purple/80">
                                        Time to add your young musician and begin their musical journey!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 text-center">
                                    <div className="space-y-6">
                                        <div className="flex flex-col items-center justify-center space-y-4 text-fun-purple md:flex-row md:space-y-0 md:space-x-6">
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink font-fredoka text-lg text-white">
                                                    1
                                                </div>
                                                <span className="font-comic font-bold">Add Student</span>
                                            </div>
                                            <div className="hidden h-px w-12 bg-fun-purple/30 md:block"></div>
                                            <div className="flex flex-col items-center space-y-2">
                                                <div
                                                    className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-purple font-fredoka text-lg text-white"
                                                    style={{ animationDelay: '0.5s' }}
                                                >
                                                    2
                                                </div>
                                                <span className="font-comic font-bold">Choose Plan</span>
                                            </div>
                                            <div className="hidden h-px w-12 bg-fun-purple/30 md:block"></div>
                                            <div className="flex flex-col items-center space-y-2">
                                                <div
                                                    className="animate-gentle-bounce flex h-12 w-12 items-center justify-center rounded-full bg-fun-green font-fredoka text-lg text-white"
                                                    style={{ animationDelay: '1s' }}
                                                >
                                                    3
                                                </div>
                                                <span className="font-comic font-bold">Start Playing!</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                                            <div className="shadow-float rounded-2xl border-2 border-fun-pink/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-pink/20">
                                                    <Users className="h-6 w-6 text-fun-pink" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-pink">Create Student Profile</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Tell us about your young pianist - their age, name, and musical dreams! 🎵
                                                </p>
                                            </div>
                                            <div className="shadow-float rounded-2xl border-2 border-fun-purple/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-purple/20">
                                                    <Heart className="h-6 w-6 text-fun-purple" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-purple">Choose Perfect Plan</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Pick the best learning plan for your child's musical journey! 🎼
                                                </p>
                                            </div>
                                            <div className="shadow-float rounded-2xl border-2 border-fun-green/20 bg-white p-6 text-center transition-transform duration-200 hover:scale-105">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fun-green/20">
                                                    <Star className="h-6 w-6 text-fun-green" />
                                                </div>
                                                <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-green">Begin the Adventure</h3>
                                                <p className="font-comic text-sm text-fun-purple/70">
                                                    Watch your child create beautiful music and grow their talent! 🌟
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <Button
                                                onClick={() => router.visit('/parent/students')}
                                                className="shadow-fun mx-auto flex items-center space-x-2 rounded-full bg-fun-pink px-8 py-4 font-fredoka text-lg font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-fun-pink/90"
                                            >
                                                <Plus className="h-6 w-6" />
                                                <span>Add Your First Student! 🎹</span>
                                            </Button>
                                            <p className="font-comic text-sm text-fun-purple/60">It only takes a minute to get started! ⏱️</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Students exist - Show selection prompt */
                        <div className="mx-auto max-w-4xl">
                            <Card className="shadow-fun rounded-3xl border-fun-blue/30 bg-gradient-to-br from-fun-blue/10 to-fun-purple/10">
                                <CardHeader className="pb-6 text-center">
                                    <div className="animate-gentle-bounce mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-blue">
                                        <Users className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle className="mb-3 font-fredoka text-3xl text-fun-purple">🎹 Your Students 🌟</CardTitle>
                                    <CardDescription className="font-comic text-xl text-fun-purple/80">
                                        Click on a student to view their dashboard and manage their piano journey!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 text-center">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {students.map((student) => (
                                            <Card
                                                key={student.id}
                                                className="shadow-float cursor-pointer rounded-2xl border-2 border-fun-purple/20 bg-white transition-all duration-200 hover:scale-105 hover:border-fun-purple/40"
                                                onClick={() => router.visit(`/student/${student.slug}`)}
                                            >
                                                <CardContent className="p-6 text-center">
                                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fun-purple font-fredoka text-2xl text-white">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <h3 className="mb-2 font-fredoka text-xl font-bold text-fun-purple">{student.name}</h3>
                                                    <p className="mb-3 font-comic text-fun-purple/70">{student.age} years old</p>

                                                    <div className="flex flex-col space-y-2">
                                                        {student.isSubscribed ? (
                                                            <Badge className="bg-green-500 text-white">Subscribed</Badge>
                                                        ) : (
                                                            <Badge className="bg-red-500 text-white">Not Subscribed</Badge>
                                                        )}

                                                        {student.instructor && (
                                                            <Badge className="bg-fun-blue text-white">👨‍🏫 {student.instructor.name}</Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="flex flex-col items-center space-y-4">
                                        <Button
                                            onClick={() => router.visit('/parent/students')}
                                            className="shadow-fun flex items-center space-x-2 rounded-full bg-fun-pink px-6 py-3 font-fredoka text-lg font-bold text-white transition-all duration-200 hover:scale-105 hover:bg-fun-pink/90"
                                        >
                                            <Plus className="h-5 w-5" />
                                            <span>Add Another Student</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Card className="shadow-float rounded-2xl border-2 border-fun-green/20 bg-white transition-all duration-200 hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <CreditCard className="mx-auto mb-4 h-12 w-12 text-fun-green" />
                                        <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-green">Subscription</h3>
                                        <p className="mb-4 font-comic text-sm text-fun-purple/70">Manage your subscription plan</p>
                                        <Button
                                            onClick={() => router.visit('/parent/subscription')}
                                            className="rounded-full bg-fun-green px-4 py-2 font-comic text-sm text-white hover:bg-fun-green/90"
                                        >
                                            View Subscription
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-float rounded-2xl border-2 border-fun-orange/20 bg-white transition-all duration-200 hover:scale-105">
                                    <CardContent className="p-6 text-center">
                                        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-fun-orange" />
                                        <h3 className="mb-2 font-fredoka text-lg font-bold text-fun-orange">Contact</h3>
                                        <p className="mb-4 font-comic text-sm text-fun-purple/70">Get in touch with us</p>
                                        <Button
                                            onClick={() => router.visit('/parent/contact')}
                                            className="rounded-full bg-fun-orange px-4 py-2 font-comic text-sm text-white hover:bg-fun-orange/90"
                                        >
                                            Contact Us
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
};

export default ParentHome;
