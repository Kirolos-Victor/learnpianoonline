import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help via email',
            contact: 'support@pianomaster.com',
            response: 'Within 24 hours',
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak with our team',
            contact: '1-800-PIANO-01',
            response: 'Mon-Fri 9AM-6PM EST',
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Instant messaging support',
            contact: 'Available on website',
            response: 'Mon-Fri 9AM-6PM EST',
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
            answer: 'We offer 20% off additional subscriptions for family members. Contact us for family plan details.',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto text-center">
                        <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">Contact & Support</h1>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Have questions about your piano lessons? Need technical support? We're here to help you succeed in your musical journey.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a Message</CardTitle>
                                    <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Your full name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="category">Category</Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            category: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="lesson-support">Lesson Support</SelectItem>
                                                        <SelectItem value="technical">Technical Issue</SelectItem>
                                                        <SelectItem value="billing">Billing Question</SelectItem>
                                                        <SelectItem value="feedback">Feedback</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    value={formData.subject}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            subject: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Brief description of your inquiry"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Please provide details about your question or issue..."
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="bg-gold hover:bg-gold/90 text-warm-brown w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* FAQ Section */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                    <CardDescription>Quick answers to common questions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="border-b pb-4 last:border-b-0">
                                                <h4 className="mb-2 font-semibold text-primary">{faq.question}</h4>
                                                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Methods & Info */}
                        <div className="space-y-6">
                            {/* Contact Methods */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Get in Touch</CardTitle>
                                    <CardDescription>Multiple ways to reach our support team</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {contactMethods.map((method, index) => (
                                        <div key={index} className="flex items-start space-x-3 rounded-lg border p-3">
                                            <method.icon className="text-gold mt-1 h-5 w-5" />
                                            <div>
                                                <h4 className="text-sm font-semibold">{method.title}</h4>
                                                <p className="mb-1 text-sm text-muted-foreground">{method.description}</p>
                                                <p className="text-sm font-medium">{method.contact}</p>
                                                <p className="text-xs text-muted-foreground">{method.response}</p>
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
                                    <div className="space-y-2 text-sm text-blue-700">
                                        <div className="flex justify-between">
                                            <span>Monday - Friday</span>
                                            <span className="font-semibold">9:00 AM - 6:00 PM EST</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Saturday</span>
                                            <span className="font-semibold">10:00 AM - 4:00 PM EST</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sunday</span>
                                            <span className="text-blue-600">Closed</span>
                                        </div>
                                        <p className="mt-3 text-xs text-blue-600">Email support is available 24/7 with responses within 24 hours</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact */}
                            <Card className="border-orange-200 bg-orange-50">
                                <CardHeader>
                                    <CardTitle className="text-orange-800">Lesson Day Issues</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-3 text-sm text-orange-700">Having trouble joining your scheduled lesson?</p>
                                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                                        Emergency Lesson Support
                                    </Button>
                                    <p className="mt-2 text-xs text-orange-600">Available 30 minutes before and during lesson times</p>
                                </CardContent>
                            </Card>

                            {/* Resource Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Helpful Resources</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Button variant="ghost" className="w-full justify-start text-sm">
                                            📚 Student Handbook
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-sm">
                                            🎥 Technical Setup Guide
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-sm">
                                            💳 Billing & Payments Guide
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-sm">
                                            🎹 Practice Tips & Resources
                                        </Button>
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
