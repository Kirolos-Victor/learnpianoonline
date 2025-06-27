import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CreditCard, Users, Check, ArrowLeft, CheckSquare } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { SharedData, SubscriptionPageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface PricingData {
    student_count: number;
    amount: number;
    students: Array<{
        id: number;
        name: string;
    }>;
}

interface AvailableStudent {
    id: number;
    name: string;
    age: number;
    is_subscribed: boolean;
}

interface SubscriptionPageData extends SubscriptionPageProps {
    isSingleStudent?: boolean;
    selectedStudentId?: string;
    subscribedStudents?: Array<{
        id: number;
        name: string;
        age: number;
        is_subscribed: boolean;
        subscription_expires_at?: string;
        sessions_remaining: number;
    }>;
}

const Subscription = () => {
    const { subscribePrice, discountPercentage } = usePage<SharedData>().props;
    const { pricingData, availableStudents, subscribedStudents, isSingleStudent, selectedStudentId } = usePage<SubscriptionPageData>().props;

    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Pre-select student if it's a single student subscription
    useEffect(() => {
        if (isSingleStudent && availableStudents.length > 0) {
            setSelectedStudents([availableStudents[0].id]);
        } else {
            setSelectedStudents([]);
        }
    }, [isSingleStudent, availableStudents]);

    const handleStudentToggle = (studentId: number) => {
        if (isSingleStudent) {
            // For single student subscriptions, always keep the student selected
            return;
        }

        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === availableStudents.length) {
            // If all are selected, deselect all
            setSelectedStudents([]);
        } else {
            // Select all available students
            setSelectedStudents(availableStudents.map(student => student.id));
        }
    };

    const handleSubscribe = async () => {
        if (selectedStudents.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch('/payment/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    student_ids: selectedStudents,
                }),
            });

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to process payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectedPricing = () => {
        return pricingData.find(pricing => pricing.student_count === selectedStudents.length);
    };

    const selectedPricing = getSelectedPricing();

    const handleBackToStudents = () => {
        router.visit('/student');
    };

    const calculateDiscount = () => {
        if (selectedStudents.length <= 1) return 0;
        const basePrice = parseFloat(subscribePrice);
        const totalWithoutDiscount = basePrice * selectedStudents.length;
        const totalWithDiscount = selectedPricing?.amount || 0;
        return totalWithoutDiscount - totalWithDiscount;
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mb-2 font-playfair text-3xl font-bold text-primary md:text-4xl">
                                    Subscription
                                </h1>
                                <p className="text-muted-foreground">
                                    Subscribe your students and get a <span className="font-bold text-green-700">10% discount</span> for each additional student you add to your subscription.
                                </p>
                            </div>
                            {isSingleStudent && (
                                <Button
                                    variant="outline"
                                    onClick={handleBackToStudents}
                                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Students
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Pricing & Benefits */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Subscription Pricing & Benefits
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="block mb-2">Base price: <b>${subscribePrice}</b> per student. For every additional student, you get a <b>10% discount</b> off their price.</span>
                                        <span className="block">Example: 2 students = ${subscribePrice} + ${subscribePrice} × 0.9</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-blue-700">
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>4 private piano lessons per month</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>Personalized homework assignments</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>Progress tracking and reports</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>Flexible scheduling options</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>Cancel anytime</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Unsubscribed Students Section */}
                            <div>
                                <h2 className="text-xl font-bold mb-2 flex items-center"><Users className="mr-2 h-5 w-5" />Select Students to Subscribe</h2>
                                <p className="mb-4 text-muted-foreground">Choose which students you want to subscribe. You can select multiple students for better discounts.</p>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="font-semibold">Unsubscribed Students</span>
                                            </div>
                                            {availableStudents.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleSelectAll}
                                                    className="text-sm"
                                                >
                                                    <CheckSquare className="mr-1 h-4 w-4" />
                                                    {selectedStudents.length === availableStudents.length ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {availableStudents.length === 0 ? (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    All your students are already subscribed or you don't have any students yet.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="space-y-3">
                                                {availableStudents.map((student) => (
                                                    <div key={student.id} className="flex items-center space-x-3 rounded-lg border p-3">
                                                        <Checkbox
                                                            id={`student-${student.id}`}
                                                            checked={selectedStudents.includes(student.id)}
                                                            onCheckedChange={() => handleStudentToggle(student.id)}
                                                        />
                                                        <label
                                                            htmlFor={`student-${student.id}`}
                                                            className="flex-1 cursor-pointer"
                                                        >
                                                            <div className="font-medium">{student.name}</div>
                                                            <div className="text-sm text-muted-foreground">Age: {student.age}</div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Subscribed Students Section */}
                            {subscribedStudents && subscribedStudents.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-2 flex items-center"><Check className="mr-2 h-5 w-5 text-green-600" />Subscribed Students</h2>
                                    <p className="mb-4 text-muted-foreground">Your currently subscribed students and their subscription details.</p>
                                    <Card>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {subscribedStudents.map((student) => (
                                                    <div key={student.id} className="flex items-center justify-between rounded-lg border p-3 bg-green-50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
                                                                <span className="text-green-700 font-semibold">
                                                                    {student.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{student.name}</div>
                                                                <div className="text-sm text-muted-foreground">Age: {student.age}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-green-700">
                                                                Expires: {student.subscription_expires_at || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {student.sessions_remaining} sessions remaining
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Discount Information */}
                            {!isSingleStudent && (
                                <Card className="border-green-200 bg-green-50">
                                    <CardHeader>
                                        <CardTitle className="text-green-800">How Discounts Work</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-green-700">
                                            <div className="flex items-center space-x-2">
                                                <Check className="h-4 w-4" />
                                                <span>1st student: Full price (${subscribePrice})</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Check className="h-4 w-4" />
                                                <span>Additional students: {discountPercentage}% discount each</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Check className="h-4 w-4" />
                                                <span>Maximum 5 students per subscription</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Selected Students</span>
                                            <span>{selectedStudents.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Monthly Price</span>
                                            <span className="font-semibold">${selectedPricing?.amount || 0}</span>
                                        </div>
                                        {selectedPricing && selectedPricing.student_count > 1 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount</span>
                                                <span>-${calculateDiscount().toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>${selectedPricing?.amount || 0}/month</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subscribe Button */}
                            <Card>
                                <CardContent className="pt-6">
                                    <Button
                                        onClick={handleSubscribe}
                                        disabled={selectedStudents.length === 0 || isLoading}
                                        className="w-full bg-primary hover:bg-primary/90"
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Subscribe Now
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        Secure payment powered by Stripe
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Debug Output (DEV ONLY) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-900">
                        <div><b>Debug Info:</b></div>
                        <div>availableStudents: <pre>{JSON.stringify(availableStudents, null, 2)}</pre></div>
                        <div>selectedStudents: <pre>{JSON.stringify(selectedStudents, null, 2)}</pre></div>
                        <div>isSingleStudent: {String(isSingleStudent)}</div>
                        <div>selectedStudentId: {String(selectedStudentId)}</div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Subscription;
