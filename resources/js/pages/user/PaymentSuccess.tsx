import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Calendar } from 'lucide-react';
import { usePage, router, Head } from '@inertiajs/react';
import { SharedData } from '@/types';

interface Subscription {
    id: number;
    amount: number;
    student_count: number;
    paid_at: string;
}

interface PaymentSuccessPageProps {
    subscription: Subscription;
    [key: string]: unknown;
}

const PaymentSuccess = () => {
    const { subscription } = usePage<PaymentSuccessPageProps>().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Head>
                <title>Payment Successful - Learn Piano Online</title>
                <meta name="description" content="Your piano lesson subscription has been successfully activated. Welcome to your musical journey!" />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Payment Successful - Learn Piano Online" />
                <meta property="og:description" content="Your piano lesson subscription has been successfully activated." />
                <meta property="og:type" content="website" />
            </Head>
            {/* Header */}
            <div className="bg-piano-gradient px-6 py-8">
                <div className="container mx-auto">
                    <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">Payment Successful!</h1>
                    <p className="text-muted-foreground">Your subscription has been activated successfully</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    {/* Success Card */}
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-green-800">Payment Completed Successfully</CardTitle>
                            <CardDescription className="text-green-600">
                                Thank you for subscribing to our piano lessons!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Subscription Details */}
                                <div className="rounded-lg bg-white p-6">
                                    <h3 className="mb-4 font-semibold text-gray-800">Subscription Details</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="text-center">
                                            <div className="mb-2 flex items-center justify-center">
                                                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-green-800">${subscription.amount}</p>
                                            <p className="text-sm text-green-600">Total Paid</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-2 flex items-center justify-center">
                                                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                                            </div>
                                            <p className="text-2xl font-bold text-green-800">{subscription.student_count}</p>
                                            <p className="text-sm text-green-600">Student{subscription.student_count > 1 ? 's' : ''} Subscribed</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mb-2 flex items-center justify-center">
                                                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-green-800">Active</p>
                                            <p className="text-sm text-green-600">Status</p>
                                        </div>
                                    </div>
                                </div>

                                {/* What's Next */}
                                <div className="rounded-lg bg-blue-50 p-6">
                                    <h3 className="mb-4 font-semibold text-blue-800">What's Next?</h3>
                                    <div className="space-y-3 text-sm text-blue-700">
                                        <div className="flex items-start space-x-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                            <span>Your instructor will be notified of your subscription</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                            <span>You'll receive an email with your lesson schedule</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                            <span>Access your dashboard to view upcoming lessons</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                            <span>Start practicing with the provided materials</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                    <Button
                                        onClick={() => router.visit('/dashboard')}
                                        className="flex-1"
                                    >
                                        Go to Dashboard
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit('/lessons')}
                                        className="flex-1"
                                    >
                                        View Lessons
                                    </Button>
                                </div>

                                {/* Support */}
                                <div className="rounded-lg bg-gray-50 p-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Need help? Contact our support team at{' '}
                                        <a href="mailto:support@learnpianoonline.com" className="text-primary hover:underline cursor-pointer">
                                            support@learnpianoonline.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
