import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ArrowRight, Check, Music, Users, MessageCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const Home = () => {
    const { subscribePrice } = usePage<SharedData>().props;

    const benefits = [
        {
            icon: Users,
            title: '1-on-1 Live Lessons',
            description: 'Personal attention from a friendly piano teacher, every week!',
            color: 'bg-fun-pink'
        },
        {
            icon: Music,
            title: 'Fun Homework Assignments',
            description: 'Practice what you learn with creative, age-appropriate homework.',
            color: 'bg-fun-blue'
        },
        {
            icon: MessageCircle,
            title: 'Personalized Feedback',
            description: 'Get helpful tips and encouragement from your teacher after every lesson.',
            color: 'bg-fun-green'
        },
    ];

    const skillLevels = ['🎹 First Time Player', '🎵 Know Some Songs', '🎼 Play a Little', '🎸 Music Lover'];

    const testimonials = [
        {
            name: 'Emma, Age 8',
            text: "I love my piano lessons! My teacher is so nice and helps me with my homework!",
            level: 'Beginner Student',
        },
        {
            name: 'Alex, Age 12',
            text: 'Learning piano is super fun! My teacher always gives me great feedback.',
            level: 'Intermediate Student',
        },
        {
            name: 'Sophie, Age 10',
            text: 'I practice every day and my teacher helps me get better every week!',
            level: 'Advanced Student',
        },
    ];

    const faqs = [
        {
            question: 'Do I need a piano?',
            answer: 'Any keyboard with 88 keys works great! Even a small one to start with! 🎹',
        },
        {
            question: 'How often do I have lessons?',
            answer: "You'll have one fun lesson per week with your teacher! 📅",
        },
        {
            question: 'Can I stop anytime?',
            answer: 'Yes! You can cancel anytime - no worries! 😊',
        },
        {
            question: "What if I'm a beginner?",
            answer: 'Perfect! We start from the very beginning and make it super fun! 🎯',
        },
    ];

    return (
        <AppLayout>
            <Head title={'Home'}></Head>
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-rainbow-gradient px-6 py-20">
                    <div className="container mx-auto text-center">
                        <div>
                            <h1 className="mb-6 font-fredoka text-5xl font-bold text-white md:text-7xl drop-shadow-lg">
                                Learn Piano
                                <span className="block text-2xl md:text-4xl font-comic">with Real Teachers! 🎹</span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-3xl text-xl md:text-2xl text-white font-comic">
                                Weekly 1-on-1 lessons, fun homework, and helpful feedback from your own piano teacher.
                            </p>
                            <div className="mb-8 flex flex-wrap justify-center gap-3">
                                {skillLevels.map((level, index) => (
                                    <span key={index} className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm md:text-base text-white font-comic border-2 border-white/30">
                                        {level}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <a href="/auth/register">
                                    <Button size="lg" className="bg-fun-green hover:bg-fun-green-600 font-comic text-xl px-8 py-4 rounded-full shadow-float">
                                        🎹 Start Learning Now!
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </a>
                                <a href="/pricing">
                                    <Button size="lg" variant="outline" className="border-white text-fun-purple hover:bg-white hover:text-fun-purple font-comic text-xl px-8 py-4 rounded-full">
                                        💰 See Prices
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-sky-gradient px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">How It Works! 🚀</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="text-center group">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-pink text-3xl font-bold text-white shadow-float group-hover:scale-105 transition-all duration-300">
                                    1
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Pick Your Level</h3>
                                <p className="text-lg font-comic text-gray-700">Tell us about your piano experience and what songs you love!</p>
                            </div>
                            <div className="text-center group">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-blue text-3xl font-bold text-white shadow-float group-hover:scale-105 transition-all duration-300">
                                    2
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Learn & Practice</h3>
                                <p className="text-lg font-comic text-gray-700">Have fun weekly lessons and practice with your teacher's help!</p>
                            </div>
                            <div className="text-center group">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-green text-3xl font-bold text-white shadow-float group-hover:scale-105 transition-all duration-300">
                                    3
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Get Feedback</h3>
                                <p className="text-lg font-comic text-gray-700">Your teacher gives you tips and encouragement every week!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="bg-fun-gradient px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">Why Kids Love Us! 💖</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {benefits.map((benefit, index) => (
                                <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-float rounded-3xl hover:scale-105 transition-all duration-300">
                                    <CardContent className="p-8 text-center">
                                        <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${benefit.color} text-white`}>
                                            <benefit.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">{benefit.title}</h3>
                                        <p className="text-lg font-comic text-gray-700">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-sunny-gradient px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">What Kids Say! 🗣️</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="border-fun-purple/20 bg-white/90 backdrop-blur-sm rounded-3xl shadow-float hover:scale-105 transition-all duration-300">
                                    <CardContent className="p-8">
                                        <p className="mb-6 text-lg font-comic text-gray-700 italic">"{testimonial.text}"</p>
                                        <div>
                                            <p className="font-fredoka text-xl font-semibold text-fun-purple">{testimonial.name}</p>
                                            <p className="text-sm font-comic text-fun-blue">{testimonial.level}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Preview */}
                <section className="bg-fun-purple px-6 py-20">
                    <div className="container mx-auto text-center">
                        <h2 className="mb-6 font-fredoka text-4xl font-bold text-white md:text-5xl">Super Simple Pricing! 💰</h2>
                        <div className="mx-auto max-w-md">
                            <Card className="border-fun-green/20 bg-white rounded-3xl shadow-float">
                                <CardContent className="p-8">
                                    <div className="text-center">
                                        <h3 className="mb-3 font-fredoka text-3xl font-bold text-fun-purple">Monthly Plan</h3>
                                        <div className="mb-6 text-5xl font-bold text-fun-green">
                                            ${subscribePrice}
                                            <span className="text-xl text-gray-600">/month</span>
                                        </div>
                                        <ul className="mb-8 space-y-3 text-left">
                                            <li className="flex items-center">
                                                <Check className="mr-3 h-5 w-5 text-fun-green" />
                                                <span className="font-comic text-lg text-gray-700">4 Live 1-on-1 Lessons</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="mr-3 h-5 w-5 text-fun-green" />
                                                <span className="font-comic text-lg text-gray-700">Fun Homework Assignments</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="mr-3 h-5 w-5 text-fun-green" />
                                                <span className="font-comic text-lg text-gray-700">Personalized Feedback</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="mr-3 h-5 w-5 text-fun-green" />
                                                <span className="font-comic text-lg text-gray-700">Cancel Anytime</span>
                                            </li>
                                        </ul>
                                        <a href="/auth/register">
                                            <Button size="lg" className="w-full bg-fun-green hover:bg-fun-green-600 font-comic text-xl py-4 rounded-full shadow-float">
                                                🎹 Start Your Journey!
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">Questions? We've Got Answers! 🤔</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="border-fun-purple/20 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10 rounded-3xl shadow-float">
                                    <CardContent className="p-6">
                                        <h3 className="mb-3 font-fredoka text-xl font-semibold text-fun-purple">{faq.question}</h3>
                                        <p className="font-comic text-lg text-gray-700">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-rainbow-gradient px-6 py-20">
                    <div className="container mx-auto text-center">
                        <h2 className="mb-6 font-fredoka text-4xl font-bold text-white md:text-5xl">Ready to Start Your Musical Adventure? 🎵</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl font-comic text-white">
                            Join thousands of kids making beautiful music every day!
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a href="/auth/register">
                                <Button size="lg" className="bg-fun-green hover:bg-fun-green-600 font-comic text-2xl px-10 py-6 rounded-full shadow-float">
                                    🎹 Start Learning Today!
                                </Button>
                            </a>
                            <a href="/contact">
                                <Button size="lg" variant="outline" className="border-white text-fun-purple hover:bg-white hover:text-fun-purple font-comic text-xl px-8 py-6 rounded-full">
                                    💬 Ask Questions
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Home;
