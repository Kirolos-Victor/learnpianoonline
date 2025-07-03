import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';

const Pricing = () => {
    const { monthlySubscribePrice } = usePage<SharedData>().props;

    const features = [
        '4 Live 1-on-1 piano lessons per month (45 min each)',
        'Personalized monthly curriculum',
        'Weekly homework assignments',
        'Detailed instructor feedback',
        'Flexible lesson scheduling',
        'Access to practice materials',
        'Progress tracking dashboard',
        'Email support',
        'Recording reviews & tips',
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
            answer: 'Yes! You get 10% off for each additional student you add to your account. Contact us for details.',
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
                    content={`Affordable piano lessons starting at $${monthlySubscribePrice}/month. Get 4 live 1-on-1 piano lessons per month with personalized curriculum, homework assignments, and expert feedback.`}
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
                        <h1 className="font-playfair mb-4 text-4xl font-bold text-primary md:text-5xl">Simple, Transparent Pricing</h1>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
                            One affordable monthly plan that includes everything you need to master the piano
                        </p>
                        <Badge className="bg-gold text-warm-brown px-4 py-2 text-sm">No setup fees • No contracts • Cancel anytime</Badge>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    {/* Main Pricing Card */}
                    <div className="mx-auto max-w-4xl">
                        <Card className="border-gold/30 mb-16 shadow-2xl">
                            <CardHeader className="pb-8 text-center">
                                <div className="mb-4">
                                    <Badge className="bg-gold text-warm-brown">Most Popular</Badge>
                                </div>
                                <CardTitle className="font-playfair mb-2 text-3xl">Monthly Piano Lessons</CardTitle>
                                <CardDescription className="text-lg">Complete piano education with personal instructor guidance</CardDescription>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold text-primary">${monthlySubscribePrice}</span>
                                    <span className="text-xl text-muted-foreground">/month</span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    That's just ${(parseFloat(monthlySubscribePrice) / 4).toFixed(2)} per lesson!
                                </p>
                                <div className="mt-4 flex justify-center">
                                    <Badge className="border border-green-300 bg-green-100 px-4 py-2 text-sm text-green-800">
                                        Enjoy 10% off for each additional student you add!
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-3">
                                        {features.slice(0, 5).map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        {features.slice(5).map((feature, index) => (
                                            <div key={index + 5} className="flex items-center space-x-3">
                                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Link href="/auth/register" className="cursor-pointer">
                                        <Button size="lg" className="bg-gold hover:bg-gold/90 text-warm-brown px-8 font-semibold">
                                            Start Learning Today
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        🔒 Secure payment • Start immediately • No long-term commitment
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Value Comparison */}
                        {/*<div className="mb-16">*/}
                        {/*    <h2 className="mb-8 text-center font-playfair text-3xl font-bold">Compare the Value</h2>*/}
                        {/*    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">*/}
                        {/*        <Card className="border-2">*/}
                        {/*            <CardHeader className="text-center">*/}
                        {/*                <CardTitle className="text-xl">Traditional In-Person</CardTitle>*/}
                        {/*                <div className="text-2xl font-bold text-muted-foreground">$80-120</div>*/}
                        {/*                <p className="text-sm text-muted-foreground">per lesson</p>*/}
                        {/*            </CardHeader>*/}
                        {/*            <CardContent>*/}
                        {/*                <ul className="space-y-2 text-sm">*/}
                        {/*                    <li>✗ Travel time required</li>*/}
                        {/*                    <li>✗ Limited scheduling</li>*/}
                        {/*                    <li>✗ No homework tracking</li>*/}
                        {/*                    <li>✗ $320-480/month</li>*/}
                        {/*                </ul>*/}
                        {/*            </CardContent>*/}
                        {/*        </Card>*/}

                        {/*        <Card className="border-gold bg-gold/5 relative border-2">*/}
                        {/*            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">*/}
                        {/*                <Badge className="bg-gold text-warm-brown">Best Value</Badge>*/}
                        {/*            </div>*/}
                        {/*            <CardHeader className="text-center">*/}
                        {/*                <CardTitle className="text-xl">mypianoclass.net</CardTitle>*/}
                        {/*                <div className="text-gold text-2xl font-bold">$49</div>*/}
                        {/*                <p className="text-sm text-muted-foreground">per month</p>*/}
                        {/*            </CardHeader>*/}
                        {/*            <CardContent>*/}
                        {/*                <ul className="space-y-2 text-sm">*/}
                        {/*                    <li>✓ Learn from home</li>*/}
                        {/*                    <li>✓ Flexible scheduling</li>*/}
                        {/*                    <li>✓ Homework & feedback</li>*/}
                        {/*                    <li>✓ Only $49/month</li>*/}
                        {/*                </ul>*/}
                        {/*            </CardContent>*/}
                        {/*        </Card>*/}

                        {/*        <Card className="border-2">*/}
                        {/*            <CardHeader className="text-center">*/}
                        {/*                <CardTitle className="text-xl">Online Apps</CardTitle>*/}
                        {/*                <div className="text-2xl font-bold text-muted-foreground">$10-30</div>*/}
                        {/*                <p className="text-sm text-muted-foreground">per month</p>*/}
                        {/*            </CardHeader>*/}
                        {/*            <CardContent>*/}
                        {/*                <ul className="space-y-2 text-sm">*/}
                        {/*                    <li>✗ No personal instructor</li>*/}
                        {/*                    <li>✗ Generic curriculum</li>*/}
                        {/*                    <li>✗ No feedback</li>*/}
                        {/*                    <li>✗ Limited progress</li>*/}
                        {/*                </ul>*/}
                        {/*            </CardContent>*/}
                        {/*        </Card>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

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
                                <h2 className="font-playfair mb-4 text-3xl font-bold">Ready to Start Your Musical Journey?</h2>
                                <p className="text-piano-white/80 mx-auto mb-6 max-w-2xl">
                                    Join hundreds of students who have transformed their piano skills with our personalized approach. Start your first
                                    lesson within 48 hours.
                                </p>
                                <Link href="/auth/register" className="cursor-pointer">
                                    <Button size="lg" className="bg-gold hover:bg-gold/90 text-warm-brown font-semibold">
                                        Get Started Now - ${monthlySubscribePrice}/month
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
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
