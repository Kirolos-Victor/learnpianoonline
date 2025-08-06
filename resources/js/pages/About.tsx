import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Award, Clock, Heart, Music, Shield, Star, Users } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: Users,
            title: 'Certified Professional Instructors',
            description: 'Learn from experienced, certified piano teachers with years of teaching experience and music education backgrounds.',
            color: 'bg-fun-blue',
        },
        {
            icon: Heart,
            title: 'Personalized Learning Experience',
            description: 'Every lesson is tailored to your skill level, musical interests, and learning pace for optimal progress.',
            color: 'bg-fun-pink',
        },
        {
            icon: Clock,
            title: 'Flexible Scheduling',
            description: 'Book lessons at times that work for you with easy rescheduling options and no rigid time commitments.',
            color: 'bg-fun-green',
        },
        {
            icon: Award,
            title: 'Proven Teaching Methods',
            description: 'Our curriculum is based on proven methods that help kids learn piano in a fun and effective way.',
            color: 'bg-fun-orange',
        },
        {
            icon: Shield,
            title: 'Safe & Secure Platform',
            description: 'Learn from the comfort of home with our secure, easy-to-use online platform designed for optimal learning.',
            color: 'bg-fun-purple',
        },
        {
            icon: Star,
            title: 'Track Your Progress',
            description: 'Monitor your improvement with detailed progress reports, achievements, and personalized feedback.',
            color: 'bg-fun-blue',
        },
    ];

    const stats = [
        { number: '600+', label: 'Happy Families', description: 'Following our journey' },
        { number: '50+', label: 'Kids Learning', description: 'Currently taking lessons' },
        { number: '100%', label: 'Fun Guaranteed', description: 'Every lesson is exciting' },
        { number: '2+', label: 'Years Experience', description: 'Teaching kids piano online' },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            text: 'My daughter has learned so much in just 3 months! The personalized approach really works.',
            level: 'Parent of 8-year-old student',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            text: 'As an adult beginner, I was nervous about learning piano. The teachers are so patient and encouraging!',
            level: 'Adult Beginner',
            rating: 5,
        },
        {
            name: 'Emma Rodriguez',
            text: "I've tried other online platforms, but this one is by far the best. The live lessons make all the difference.",
            level: 'Intermediate Student',
            rating: 5,
        },
    ];

    return (
        <AppLayout>
            <Head>
                <title>About Us - Fun Piano Lessons for Kids | Learn Piano Online</title>
                <meta
                    name="description"
                    content="Why kids love our online piano lessons! Join 600+ happy families and 50+ kids currently learning with friendly teachers. Fun, personalized lessons for children ages 5+!"
                />
                <meta
                    name="keywords"
                    content="about kids piano lessons, piano lessons for children, why choose piano lessons for kids, kid-friendly piano teachers, fun piano lessons, children music education"
                />
                <meta property="og:title" content="About Us - Fun Piano Lessons for Kids | Learn Piano Online" />
                <meta
                    property="og:description"
                    content="Why kids love our online piano lessons! Join 600+ happy families and 50+ kids currently learning with friendly teachers."
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="About Us - Fun Piano Lessons for Kids" />
                <meta name="twitter:description" content="Join 600+ happy families and 50+ kids currently learning piano with friendly teachers." />
            </Head>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-piano-gradient px-6 py-20">
                    <div className="container mx-auto text-center">
                        <h1 className="mb-6 font-fredoka text-4xl font-bold text-fun-purple md:text-6xl">Why Kids Love Learning Piano With Us! 🎵</h1>
                        <p className="mx-auto mb-8 max-w-3xl font-comic text-xl text-gray-700 md:text-2xl">
                            Join hundreds of kids who are having fun learning piano with our friendly teachers and exciting lessons!
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="font-playfair text-3xl font-bold text-primary md:text-4xl">{stat.number}</div>
                                    <div className="font-semibold text-primary">{stat.label}</div>
                                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="font-playfair mb-12 text-center text-3xl font-bold text-primary md:text-4xl">What Makes Us Different</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div
                                            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.color} text-white`}
                                        >
                                            <feature.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="font-playfair mb-3 text-xl font-semibold text-primary">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="bg-fun-gradient px-6 py-20">
                    <div className="container mx-auto">
                        <h2 className="font-playfair mb-12 text-center text-3xl font-bold text-primary md:text-4xl">What Our Students Say</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <Card
                                    key={index}
                                    className="shadow-float rounded-3xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                >
                                    <CardContent className="p-8">
                                        <div className="mb-4 flex justify-center">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="mb-6 text-center text-muted-foreground italic">"{testimonial.text}"</p>
                                        <div className="text-center">
                                            <p className="font-playfair text-lg font-semibold text-primary">{testimonial.name}</p>
                                            <p className="text-sm text-fun-blue">{testimonial.level}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section className="bg-white px-6 py-20">
                    <div className="container mx-auto">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="font-playfair mb-8 text-3xl font-bold text-primary md:text-4xl">Our Mission</h2>
                            <p className="mb-8 text-xl text-muted-foreground">
                                We believe that everyone deserves access to high-quality music education. Our mission is to make professional piano
                                instruction accessible, affordable, and enjoyable for students of all ages and skill levels around the world.
                            </p>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="text-center">
                                    <Music className="mx-auto mb-4 h-12 w-12 text-fun-blue" />
                                    <h3 className="font-playfair mb-2 text-xl font-semibold text-primary">Quality Education</h3>
                                    <p className="text-muted-foreground">Professional instruction that meets the highest standards</p>
                                </div>
                                <div className="text-center">
                                    <Heart className="mx-auto mb-4 h-12 w-12 text-fun-pink" />
                                    <h3 className="font-playfair mb-2 text-xl font-semibold text-primary">Personalized Care</h3>
                                    <p className="text-muted-foreground">Every student receives individual attention and support</p>
                                </div>
                                <div className="text-center">
                                    <Star className="mx-auto mb-4 h-12 w-12 text-fun-orange" />
                                    <h3 className="font-playfair mb-2 text-xl font-semibold text-primary">Proven Results</h3>
                                    <p className="text-muted-foreground">Track record of student success and satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-fun-purple px-6 py-20">
                    <div className="container mx-auto text-center">
                        <h2 className="font-playfair mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Start Your Piano Journey?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
                            Join hundreds of kids who are already making beautiful music with our fun teaching methods!
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('register')}
                                className="shadow-float inline-flex items-center justify-center rounded-full bg-fun-green px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-fun-green-600"
                            >
                                🎹 Start Learning Today
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href={route('pricing.index')}
                                className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-fun-purple"
                            >
                                💰 View Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default About;
