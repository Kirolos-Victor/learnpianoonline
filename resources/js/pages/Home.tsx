import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Clock, MessageCircle, Music, Trophy, Users } from 'lucide-react';

const Home = () => {
    const benefits = [
        {
            icon: Users,
            title: '1-on-1 Live Lessons',
            description: 'Personal attention from a friendly piano teacher, every week!',
            color: 'bg-fun-pink',
        },
        {
            icon: Music,
            title: 'Personalized Homework',
            description: 'Get custom practice assignments from your teacher during each lesson.',
            color: 'bg-fun-blue',
        },
        {
            icon: MessageCircle,
            title: 'Personalized Feedback',
            description: 'Get helpful tips and encouragement from your teacher after every lesson.',
            color: 'bg-fun-green',
        },
    ];

    const subscriptionBenefits = [
        {
            icon: BookOpen,
            title: 'Structured Learning Path',
            description: 'Follow a carefully designed curriculum that builds your skills step by step.',
            color: 'bg-fun-purple',
        },
        {
            icon: Clock,
            title: 'Flexible Scheduling',
            description: 'Book lessons at times that work for you with easy rescheduling options.',
            color: 'bg-fun-orange',
        },
        {
            icon: Trophy,
            title: 'Track Your Progress',
            description: 'See your improvement over time with detailed progress reports and achievements.',
            color: 'bg-fun-green',
        },
    ];

    const skillLevels = ['🎹 First Time Player', '🎵 Know Some Songs', '🎼 Play a Little', '🎸 Music Lover'];

    const testimonials = [
        {
            name: 'Emma, Age 8',
            text: 'I love my piano lessons! My teacher gives me perfect homework that helps me practice exactly what I need!',
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
            question: 'How does homework work?',
            answer: 'Your teacher gives you personalized practice assignments during each lesson! 📝',
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
            <Head>
                <title>Learn Piano Online - Fun Piano Lessons for Kids | Start Today</title>
                <meta
                    name="description"
                    content="Fun online piano lessons for kids ages 5+! Weekly 1-on-1 lessons with friendly teachers, personalized homework, and helpful feedback. Make learning piano exciting and easy for your child!"
                />
                <meta
                    name="keywords"
                    content="piano lessons for kids, online piano lessons, learn piano online, piano teacher for children, kids piano lessons, piano lessons for beginners, virtual piano lessons for kids, children piano instruction, music lessons for kids online"
                />
                <meta property="og:title" content="Learn Piano Online - Fun Piano Lessons for Kids | Start Today" />
                <meta
                    property="og:description"
                    content="Fun online piano lessons for kids ages 5+! Weekly 1-on-1 lessons with friendly teachers, personalized homework, and helpful feedback."
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Learn Piano Online - Fun Piano Lessons for Kids | Start Today" />
                <meta
                    name="twitter:description"
                    content="Fun online piano lessons for kids ages 5+! Weekly 1-on-1 lessons with friendly teachers, personalized homework, and helpful feedback."
                />
            </Head>
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-rainbow-gradient px-6 py-20">
                    <div className="container mx-auto text-center">
                        <div>
                            <h1 className="mb-6 font-fredoka text-5xl font-bold text-white drop-shadow-lg md:text-7xl">
                                Learn Piano
                                <span className="block font-comic text-2xl md:text-4xl">with Real Teachers! 🎹</span>
                            </h1>
                            <p className="mx-auto mb-8 max-w-3xl font-comic text-xl text-white md:text-2xl">
                                Weekly 1-on-1 lessons with personalized homework assignments and helpful feedback from your own piano teacher.
                            </p>
                            <div className="mb-8 flex flex-wrap justify-center gap-3">
                                {skillLevels.map((level, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full border-2 border-white/30 bg-white/20 px-4 py-2 font-comic text-sm text-white backdrop-blur-sm md:text-base"
                                    >
                                        {level}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="shadow-float inline-flex items-center justify-center rounded-full bg-fun-green px-8 py-4 font-comic text-xl text-white transition-all duration-300 hover:bg-fun-green-600"
                                >
                                    🎹 Start Learning Now!
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href={route('pricing.index')}
                                    className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 font-comic text-xl text-white transition-all duration-300 hover:bg-white hover:text-fun-purple"
                                >
                                    💰 View Plans
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-sky-gradient px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">How It Works! 🚀</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="group text-center">
                                <div className="shadow-float mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-pink text-3xl font-bold text-white transition-all duration-300 group-hover:scale-105">
                                    1
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Pick Your Level</h3>
                                <p className="font-comic text-lg text-gray-700">Tell us about your piano experience and what songs you love!</p>
                            </div>
                            <div className="group text-center">
                                <div className="shadow-float mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-blue text-3xl font-bold text-white transition-all duration-300 group-hover:scale-105">
                                    2
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Learn & Practice</h3>
                                <p className="font-comic text-lg text-gray-700">Have fun weekly lessons and practice with your teacher's help!</p>
                            </div>
                            <div className="group text-center">
                                <div className="shadow-float mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fun-green text-3xl font-bold text-white transition-all duration-300 group-hover:scale-105">
                                    3
                                </div>
                                <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">Get Feedback</h3>
                                <p className="font-comic text-lg text-gray-700">Your teacher gives you tips and encouragement every week!</p>
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
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div
                                            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${benefit.color} text-white`}
                                        >
                                            <benefit.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">{benefit.title}</h3>
                                        <p className="font-comic text-lg text-gray-700">{benefit.description}</p>
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
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-fun-purple/20 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="p-8">
                                        <p className="mb-6 font-comic text-lg text-gray-700 italic">"{testimonial.text}"</p>
                                        <div>
                                            <p className="font-fredoka text-xl font-semibold text-fun-purple">{testimonial.name}</p>
                                            <p className="font-comic text-sm text-fun-blue">{testimonial.level}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Subscription Benefits Overview */}
                <section className="bg-fun-purple px-6 py-20">
                    <div className="container mx-auto">
                        <div className="mb-12 text-center">
                            <h2 className="mb-6 font-fredoka text-4xl font-bold text-white md:text-5xl">Why Choose Our Subscription? 🌟</h2>
                            <p className="mx-auto max-w-2xl font-comic text-xl text-white/90">
                                Join hundreds of kids who are making amazing progress with our fun learning approach!
                            </p>
                        </div>

                        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {subscriptionBenefits.map((benefit, index) => (
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div
                                            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${benefit.color} text-white`}
                                        >
                                            <benefit.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="mb-3 font-fredoka text-2xl font-semibold text-fun-purple">{benefit.title}</h3>
                                        <p className="font-comic text-lg text-gray-700">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center">
                            <div className="mx-auto max-w-2xl rounded-3xl bg-white/10 p-8 backdrop-blur-sm">
                                <h3 className="mb-4 font-fredoka text-2xl font-bold text-white">Ready to Start Your Journey? 🚀</h3>
                                <p className="mb-6 font-comic text-white/90">Begin your musical adventure today with personalized piano lessons!</p>
                                <Link
                                    href={route('register')}
                                    className="shadow-float inline-flex items-center justify-center rounded-full bg-fun-green px-8 py-4 font-comic text-lg text-white transition-all duration-300 hover:bg-fun-green-600"
                                >
                                    🎹 Get Started Now!
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="mb-12 text-center font-fredoka text-4xl font-bold text-fun-purple md:text-5xl">
                            Questions? We've Got Answers! 🤔
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {faqs.map((faq, index) => (
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-fun-purple/20 bg-gradient-to-r from-fun-pink/10 to-fun-blue/10"
                                >
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
                        <p className="mx-auto mb-8 max-w-2xl font-comic text-xl text-white">
                            Join hundreds of kids making beautiful music every day!
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('register')}
                                className="shadow-float inline-flex items-center justify-center rounded-full bg-fun-green px-10 py-6 font-comic text-2xl text-white transition-all duration-300 hover:bg-fun-green-600"
                            >
                                🎹 Start Learning Today!
                            </Link>
                            <Link
                                href={route('contact.index')}
                                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-6 font-comic text-xl text-white transition-all duration-300 hover:bg-white hover:text-fun-purple"
                            >
                                💬 Ask Questions
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default Home;
