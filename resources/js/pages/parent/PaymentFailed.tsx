import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ParentLayout from '@/layouts/parent-layout';
import { Head, router } from '@inertiajs/react';
import { RefreshCw, XCircle } from 'lucide-react';

const PaymentFailed = () => {
    return (
        <ParentLayout>
            <Head>
                <title>Payment Failed - Learn Piano Online</title>
                <meta
                    name="description"
                    content="There was an issue processing your payment. Please try again or contact our support team for assistance."
                />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:title" content="Payment Failed - Learn Piano Online" />
                <meta property="og:description" content="There was an issue processing your payment. Please try again." />
                <meta property="og:type" content="website" />
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <h1 className="font-playfair mb-2 text-3xl font-bold text-primary md:text-4xl">Payment Failed</h1>
                        <p className="text-muted-foreground">We couldn't process your payment. Please try again.</p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="mx-auto max-w-2xl">
                        {/* Failed Card */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Payment Could Not Be Processed</CardTitle>
                                <CardDescription className="text-red-600">
                                    Don't worry, your card hasn't been charged. Please try again or contact support.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Common Issues */}
                                    <div className="rounded-lg bg-white p-6">
                                        <h3 className="mb-4 font-semibold text-gray-800">Common Payment Issues</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-red-600"></div>
                                                <span>Insufficient funds in your account</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-red-600"></div>
                                                <span>Card has expired or is invalid</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-red-600"></div>
                                                <span>Bank declined the transaction</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-red-600"></div>
                                                <span>Network connectivity issues</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What You Can Do */}
                                    <div className="rounded-lg bg-blue-50 p-6">
                                        <h3 className="mb-4 font-semibold text-blue-800">What You Can Do</h3>
                                        <div className="space-y-3 text-sm text-blue-700">
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                                <span>Check your card details and try again</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                                <span>Contact your bank to ensure the card is active</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                                <span>Try using a different payment method</span>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                                                <span>Contact our support team for assistance</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                                        <Button onClick={() => router.visit('/parent/subscription')} className="flex-1">
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Try Again
                                        </Button>
                                        <Button variant="outline" onClick={() => router.visit(route('parent.contact'))} className="flex-1">
                                            Contact Support
                                        </Button>
                                    </div>

                                    {/* Important Notice */}
                                    <Alert>
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <span className="font-semibold">Important:</span> No charges have been made to your account. Your
                                            subscription will only be activated after a successful payment.
                                        </AlertDescription>
                                    </Alert>

                                    {/* Support Contact */}
                                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                                        <p className="text-sm text-gray-600">
                                            Need immediate assistance? Contact us at{' '}
                                            <a href="mailto:support@learnpianoonline.com" className="cursor-pointer text-primary hover:underline">
                                                support@learnpianoonline.com
                                            </a>{' '}
                                            or call us at{' '}
                                            <a href="tel:+1234567890" className="cursor-pointer text-primary hover:underline">
                                                +1 (234) 567-890
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

export default PaymentFailed;
