import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Check, CreditCard } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const Subscription = () => {
    const { subscribePrice } = usePage<SharedData>().props;

    const currentPlan = {
        name: 'Monthly Plan',
        price: parseFloat(subscribePrice),
        nextBilling: 'April 15, 2024',
        lessonsRemaining: 2,
        status: 'active',
    };

    const paymentHistory = [
        {
            date: 'March 15, 2024',
            amount: parseFloat(subscribePrice),
            status: 'paid',
            invoice: '#INV-001234',
        },
        {
            date: 'February 15, 2024',
            amount: parseFloat(subscribePrice),
            status: 'paid',
            invoice: '#INV-001233',
        },
        {
            date: 'January 15, 2024',
            amount: parseFloat(subscribePrice),
            status: 'paid',
            invoice: '#INV-001232',
        },
    ];

    const planFeatures = [
        '4 Live 1-on-1 lessons per month',
        'Monthly structured curriculum',
        'Homework assignments & feedback',
        'Practice material access',
        'Email support',
        'Flexible scheduling',
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-piano-gradient px-6 py-8">
                <div className="container mx-auto">
                    <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">Subscription Management</h1>
                    <p className="text-muted-foreground">Manage your subscription, billing, and payment methods</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Current Plan */}
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center text-green-800">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Current Subscription
                                    </CardTitle>
                                    <Badge className="bg-green-600">Active</Badge>
                                </div>
                                <CardDescription className="text-green-600">Your piano learning journey is in progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="rounded-lg bg-white p-4 text-center">
                                        <p className="text-2xl font-bold text-green-800">${currentPlan.price}</p>
                                        <p className="text-sm text-green-600">per month</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 text-center">
                                        <p className="text-2xl font-bold text-green-800">{currentPlan.lessonsRemaining}</p>
                                        <p className="text-sm text-green-600">lessons remaining</p>
                                    </div>
                                    <div className="rounded-lg bg-white p-4 text-center">
                                        <p className="text-sm font-semibold text-green-800">Next billing</p>
                                        <p className="text-sm text-green-600">{currentPlan.nextBilling}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <Button variant="outline" className="flex-1">
                                        Update Payment Method
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        Change Plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plan Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Plan Includes</CardTitle>
                                <CardDescription>Everything you need to master the piano</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {planFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="text-gold mr-2 h-5 w-5" />
                                    Payment History
                                </CardTitle>
                                <CardDescription>Your billing and payment records</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {paymentHistory.map((payment, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <p className="font-semibold">{payment.date}</p>
                                                <p className="text-sm text-muted-foreground">{payment.invoice}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${payment.amount}</p>
                                                <Badge variant="outline" className="border-green-600 text-green-600">
                                                    Paid
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <Button variant="outline" size="sm">
                                        View All Invoices
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cancellation Warning */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <span className="font-semibold">Cancellation Policy:</span> You can cancel anytime. Your access will continue until
                                the end of your current billing period. No refunds for partial months.
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    Download Invoice
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Update Billing Info
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Change Payment Method
                                </Button>
                                <Button variant="destructive" className="w-full justify-start">
                                    Cancel Subscription
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-blue-700">
                                    Having issues with billing or payments? Our support team is here to help.
                                </p>
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Usage Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>This Month's Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Lessons attended</span>
                                        <span className="font-semibold">2/4</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Homework submitted</span>
                                        <span className="font-semibold">3</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Practice hours logged</span>
                                        <span className="font-semibold">18.5h</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Offers */}
                        <Card className="border-gold/50 bg-gold/5">
                            <CardHeader>
                                <CardTitle className="text-gold">Special Offer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-3 text-sm">Refer a friend and both get 50% off your next month!</p>
                                <Button size="sm" className="bg-gold hover:bg-gold/90 text-warm-brown w-full">
                                    Share Referral Code
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
