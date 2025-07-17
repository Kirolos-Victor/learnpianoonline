import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Crown, Zap } from 'lucide-react';

const Pricing = () => {
    const { monthlySubscribePrice, yearlySubscribePrice, discountPercentage } = usePage<SharedData>().props;

    // Calculate yearly savings
    const monthlyPrice = parseFloat(monthlySubscribePrice);
    const yearlyPrice = parseFloat(yearlySubscribePrice);
    const yearlySavings = monthlyPrice * 12 - yearlyPrice;
    const yearlyDiscountPercentage = Math.round((yearlySavings / (monthlyPrice * 12)) * 100);

    const monthlyFeatures = [
        '4 Live 1-on-1 piano lessons per month (45 min each)',
        'Personalized monthly curriculum',
        'Personalized homework assignments from your teacher',
        'Detailed instructor feedback',
        'Flexible lesson scheduling',
        'Access to practice materials',
        'Progress tracking dashboard',
        'Email support',
        'Recording reviews & tips',
        'Cancel anytime - no contracts',
    ];

    const yearlyFeatures = [
        '48 Live 1-on-1 piano lessons per year (45 min each)',
        'Personalized yearly curriculum',
        'Personalized homework assignments from your teacher',
        'Priority instructor support',
        'Advanced lesson scheduling',
        'Premium practice materials & resources',
        'Enhanced progress tracking dashboard',
        'Priority email & phone support',
        'Recording reviews & detailed feedback',
        'Bonus seasonal workshops',
        'Cancel anytime - no contracts',
    ];

    const testimonials = [
        {
            name: 'Jessica M.',
            text: "Best investment I've made in myself! The personalized attention is incredible.",
            level: 'Beginner',
        },
        {
            name: 'Robert K.',
            text: 'Finally making real progress after years of trying to self-teach piano.',
            level: 'Intermediate',
        },
        {
            name: 'Maria L.',
            text: 'My 12-year-old daughter loves her piano lessons and practices every day now!',
            level: 'Parent',
        },
    ];

    const faqs = [
        {
            question: 'What if I need to miss a lesson?',
            answer: "You can reschedule up to 4 hours before your lesson time. We'll help you find another slot that works for you.",
        },
        {
            question: 'Do I need my own piano?',
            answer: 'A digital piano or weighted-key keyboard is recommended, but you can start with any 88-key instrument.',
        },
        {
            question: 'Can I change instructors?',
            answer: "Absolutely! We'll help you find the perfect instructor match for your learning style and musical goals.",
        },
        {
            question: 'Is there a family discount?',
            answer: `Yes! You get ${discountPercentage}% off for each additional student you add to your account. Contact us for details.`,
        },
        {
            question: 'What happens if I cancel?',
            answer: 'You can cancel anytime. Your access continues until the end of your current billing period with no cancellation fees.',
        },
        {
            question: 'How quickly can I start?',
            answer: "Usually within 24-48 hours! We'll match you with an instructor and you can book your first lesson right away.",
        },
    ];

    return (
        <AppLayout>
            <Head>
                <title>Piano Lessons Pricing - Learn Piano Online</title>
                <meta
                    name="description"
                    content={`Affordable piano lessons starting at $${monthlySubscribePrice}/month. Get 4 live 1-on-1 piano lessons per month with personalized curriculum, custom homework assignments, and expert feedback.`}
                />
                <meta
                    name="keywords"
                    content="piano lessons pricing, online piano lessons cost, affordable piano lessons, piano teacher rates, piano lesson packages"
                />
                <meta property="og:title" content="Piano Lessons Pricing - Learn Piano Online" />
                <meta
                    property="og:description"
                    content={`Affordable piano lessons starting at $${monthlySubscribePrice}/month. Get 4 live 1-on-1 piano lessons per month with personalized curriculum.`}
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Piano Lessons Pricing - Learn Piano Online" />
                <meta
                    name="twitter:description"
                    content={`Affordable piano lessons starting at $${monthlySubscribePrice}/month. Get 4 live 1-on-1 piano lessons per month.`}
                />
            </Head>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-16">
                    <div className="container mx-auto text-center">
                        <h1 className="font-playfair mb-4 text-4xl font-bold text-primary md:text-5xl">Choose Your Perfect Plan</h1>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
                            Flexible pricing options designed to fit your musical journey and budget
                        </p>
                        <Badge className="bg-gold text-warm-brown px-4 py-2 text-sm">No setup fees • No contracts • Cancel anytime</Badge>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    {/* Main Pricing Cards - Side by Side */}
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Monthly Plan */}
                            <Card className="border-gold/30 relative shadow-xl">
                                <div className="absolute -top-3 left-6">
                                    <Badge className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                                        <Zap className="mr-1 h-3 w-3" />
                                        Most Popular
                                    </Badge>
                                </div>
                                <CardHeader className="pb-6 text-center">
                                    <CardTitle className="font-playfair mb-2 text-2xl">Monthly Plan</CardTitle>
                                    <CardDescription className="text-base">Perfect for getting started with piano</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-primary">${monthlySubscribePrice}</span>
                                        <span className="text-lg text-muted-foreground">/month</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        That's just ${(parseFloat(monthlySubscribePrice) / 4).toFixed(2)} per lesson!
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h4 className="mb-4 text-center font-semibold">What's Included:</h4>
                                        <div className="space-y-3">
                                            {monthlyFeatures.map((feature, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Yearly Plan */}
                            <Card className="border-gold from-gold/5 to-warm-brown/5 relative bg-gradient-to-br shadow-2xl">
                                <div className="absolute -top-3 left-6">
                                    <Badge className="flex animate-pulse items-center bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                                        <Crown className="mr-1 h-3 w-3" />
                                        Best Value
                                    </Badge>
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <div className="rotate-12 animate-bounce rounded-full bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 text-sm font-bold text-white shadow-lg">
                                        Save {yearlyDiscountPercentage}%!
                                    </div>
                                </div>
                                <CardHeader className="pb-6 text-center">
                                    <CardTitle className="font-playfair mb-2 text-2xl">Yearly Plan</CardTitle>
                                    <CardDescription className="text-base">Best value for serious learners</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-primary">${yearlySubscribePrice}</span>
                                        <span className="text-lg text-muted-foreground">/year</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-3 py-1 text-sm font-semibold text-white shadow-md">
                                            Save ${yearlySavings.toFixed(2)} compared to monthly
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        That's just ${(parseFloat(yearlySubscribePrice) / 48).toFixed(2)} per lesson!
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h4 className="mb-4 text-center font-semibold">Everything in Monthly, Plus:</h4>
                                        <div className="space-y-3">
                                            {yearlyFeatures.map((feature, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <Check
                                                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                                            feature.includes('Priority') ||
                                                            feature.includes('Premium') ||
                                                            feature.includes('Enhanced') ||
                                                            feature.includes('Bonus')
                                                                ? 'text-gold'
                                                                : 'text-green-500'
                                                        }`}
                                                    />
                                                    <span
                                                        className={`text-sm ${
                                                            feature.includes('Priority') ||
                                                            feature.includes('Premium') ||
                                                            feature.includes('Enhanced') ||
                                                            feature.includes('Bonus')
                                                                ? 'text-gold font-medium'
                                                                : ''
                                                        }`}
                                                    >
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Start Your Journey Button */}
                        <div className="mb-16 text-center">
                            <div className="shadow-float mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-fun-pink/10 to-fun-blue/10 p-8">
                                <h3 className="font-playfair mb-4 text-2xl font-bold text-primary">Ready to Begin Your Musical Journey? 🎹</h3>
                                <p className="mx-auto mb-6 max-w-lg text-muted-foreground">
                                    Choose your perfect plan and start learning piano with personalized instruction tailored just for you.
                                </p>
                                <Link
                                    href={route('register')}
                                    className="shadow-float bg-gold hover:bg-gold/90 text-warm-brown inline-flex items-center justify-center rounded-full px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                                >
                                    🚀 Start Your Journey
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="mb-16">
                            <h2 className="font-playfair mb-8 text-center text-3xl font-bold">What Students Say</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {testimonials.map((testimonial, index) => (
                                    <Card key={index} className="border-gold/20">
                                        <CardContent className="p-6">
                                            <p className="mb-4 text-muted-foreground italic">"{testimonial.text}"</p>
                                            <div>
                                                <p className="font-semibold">{testimonial.name}</p>
                                                <p className="text-gold text-sm">{testimonial.level}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="mb-16">
                            <h2 className="font-playfair mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="rounded-lg border p-6">
                                        <h3 className="font-playfair mb-2 text-lg font-semibold text-primary">{faq.question}</h3>
                                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final CTA */}
                        <Card className="bg-warm-brown text-piano-white text-center">
                            <CardContent className="p-8">
                                <h2 className="font-playfair mb-4 text-3xl font-bold">Transform Your Musical Dreams Into Reality</h2>
                                <p className="text-piano-white/80 mx-auto mb-6 max-w-2xl">
                                    Join hundreds of students who have transformed their piano skills with our personalized approach. Start your first
                                    lesson within 48 hours and begin your musical journey today.
                                </p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <Link
                                        href={route('register')}
                                        className="shadow-float bg-gold hover:bg-gold/90 text-warm-brown inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        🎹 Start Your Journey
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={route('contact.index')}
                                        className="border-piano-white text-piano-white hover:bg-piano-white hover:text-warm-brown inline-flex items-center justify-center rounded-full border-2 bg-transparent px-8 py-3 transition-all duration-300"
                                    >
                                        💬 Have Questions?
                                    </Link>
                                </div>
                                <p className="text-piano-white/60 mt-4 text-sm">Cancel anytime • No setup fees • Start immediately</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Pricing;
