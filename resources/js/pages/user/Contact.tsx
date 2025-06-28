import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Clock, Mail, MessageCircle, Phone } from 'lucide-react';

const Contact = () => {
    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help via email',
            contact: 'support@learnpianoonline.com',
            response: 'Within 48 hours',
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak with our team',
            contact: '1-800-PIANO-01',
            response: 'Available 24/7',
        },
    ];

    const faqs = [
        {
            question: 'How do I reschedule a lesson?',
            answer: 'You can reschedule lessons up to 4 hours before the scheduled time through your dashboard or by contacting support.',
        },
        {
            question: 'What if I miss a lesson?',
            answer: 'Missed lessons without 24-hour notice cannot be rescheduled, but you can use your remaining lessons in the month.',
        },
        {
            question: 'Can I switch instructors?',
            answer: "Yes! You can request a different instructor at any time. We'll help you find the best match for your learning style.",
        },
        {
            question: 'Is there a family discount?',
            answer: 'We offer 10% off for each additional student you add to your account. Contact us for details.',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-16">
                    <div className="container mx-auto text-center">
                        <h1 className="mb-4 font-playfair text-4xl font-bold text-primary md:text-5xl">Contact & Support</h1>
                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                            Have questions about your piano lessons? Need technical support? We're here to help you succeed in your musical journey.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Contact Methods */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Get in Touch</CardTitle>
                                    <CardDescription>Multiple ways to reach our support team</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {contactMethods.map((method, index) => (
                                        <div key={index} className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                                            <method.icon className="text-gold mt-1 h-6 w-6 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-lg font-semibold text-primary">{method.title}</h4>
                                                <p className="mb-2 text-muted-foreground">{method.description}</p>
                                                <p className="text-lg font-medium text-primary">{method.contact}</p>
                                                <p className="text-sm text-muted-foreground">{method.response}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Support Hours */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-800">
                                        <Clock className="mr-2 h-5 w-5" />
                                        Support Hours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-blue-700">
                                        <div className="flex justify-between">
                                            <span>Monday - Sunday</span>
                                            <span className="font-semibold">24/7 Available</span>
                                        </div>
                                        <p className="mt-4 text-sm text-blue-600">Email support responses within 48 hours</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                                    <CardDescription>Quick answers to common questions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                                <h4 className="mb-3 text-lg font-semibold text-primary">{faq.question}</h4>
                                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Contact;
