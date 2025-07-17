import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ParentLayout from '@/layouts/parent-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, CreditCard } from 'lucide-react';

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
        <ParentLayout>
            <Head>
                <title>Payment Successful - Learn Piano Online</title>
                <meta name="description" content="Your piano lesson subscription has been successfully activated. Welcome to your musical journey!" />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Payment Successful - Learn Piano Online" />
                <meta property="og:description" content="Your piano lesson subscription has been successfully activated." />
                <meta property="og:type" content="website" />
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <h1 className="font-playfair mb-2 text-3xl font-bold text-primary md:text-4xl">Payment Successful!</h1>
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
                                <CardDescription className="text-green-600">Thank you for subscribing to our piano lessons!</CardDescription>
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
                                                <p className="text-sm text-green-600">
                                                    Student{subscription.student_count > 1 ? 's' : ''} Subscribed
                                                </p>
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
                                        <div className="space-y-4 text-sm text-blue-700">
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    1
                                                </div>
                                                <div>
                                                    <span className="font-medium">Instructor Assignment</span>
                                                    <p className="mt-1 text-blue-600">
                                                        You will be assigned to an instructor within the next 24-48 hours
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    2
                                                </div>
                                                <div>
                                                    <span className="font-medium">Lesson Management</span>
                                                    <p className="mt-1 text-blue-600">
                                                        View and manage all your lessons through the platform dashboard
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    3
                                                </div>
                                                <div>
                                                    <span className="font-medium">Direct Communication</span>
                                                    <p className="mt-1 text-blue-600">Contact your instructor directly through the platform chat</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    4
                                                </div>
                                                <div>
                                                    <span className="font-medium">Video Call Invitations</span>
                                                    <p className="mt-1 text-blue-600">
                                                        Receive invitation links for video calls from your instructor before each session
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    5
                                                </div>
                                                <div>
                                                    <span className="font-medium">Support Available</span>
                                                    <p className="mt-1 text-blue-600">Feel free to contact us if you face any difficulties</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                                        <Button onClick={() => router.visit('/parent')} className="flex-1">
                                            Go to Dashboard
                                        </Button>
                                        <Button variant="outline" onClick={() => router.visit('/parent/students')} className="flex-1">
                                            View Students
                                        </Button>
                                    </div>

                                    {/* Support */}
                                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                                        <p className="text-sm text-gray-600">
                                            Need help? Contact our support team at{' '}
                                            <a href="mailto:support@learnpianoonline.com" className="cursor-pointer text-primary hover:underline">
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
        </ParentLayout>
    );
};

export default PaymentSuccess;
