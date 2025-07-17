import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ParentLayout from '@/layouts/parent-layout';
import { SharedData, SubscriptionPageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Check, CheckSquare, CreditCard, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SubscriptionPageData extends SubscriptionPageProps {
    isSingleStudent?: boolean;
    selectedStudentSlug?: string;
    selectedStudentSlugs?: string;
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
    const { monthlySubscribePrice, yearlySubscribePrice, discountPercentage, csrf_token } = usePage<SharedData>().props;
    const { pricingData, availableStudents, subscribedStudents, isSingleStudent, selectedStudentSlug, selectedStudentSlugs } =
        usePage<SubscriptionPageData>().props;

    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(false);

    // Pre-select student(s) if provided via URL parameters
    useEffect(() => {
        if (isSingleStudent && availableStudents.length > 0) {
            setSelectedStudents([availableStudents[0].id]);
        } else if (selectedStudentSlug && availableStudents.length > 0) {
            // Pre-select the specific student if selectedStudentSlug is provided
            const studentExists = availableStudents.find((student) => student.slug === selectedStudentSlug);
            if (studentExists) {
                setSelectedStudents([studentExists.id]);
            }
        } else if (selectedStudentSlugs && availableStudents.length > 0) {
            // Pre-select multiple students if selectedStudentSlugs is provided (for bulk selection)
            const slugsArray = selectedStudentSlugs.split(',');
            const studentIds = availableStudents.filter((student) => slugsArray.includes(student.slug)).map((student) => student.id);
            if (studentIds.length > 0) {
                setSelectedStudents(studentIds);
            }
        } else {
            setSelectedStudents([]);
        }
    }, [isSingleStudent, selectedStudentSlug, selectedStudentSlugs, availableStudents]);

    const handleStudentToggle = (studentId: number) => {
        if (isSingleStudent) {
            // For single student subscriptions, always keep the student selected
            return;
        }

        setSelectedStudents((prev) => (prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]));
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === availableStudents.length) {
            // If all are selected, deselect all
            setSelectedStudents([]);
        } else {
            // Select all available students
            setSelectedStudents(availableStudents.map((student) => student.id));
        }
    };

    const handleSubscribe = async () => {
        if (selectedStudents.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch('/parent/payment/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: JSON.stringify({
                    student_ids: selectedStudents,
                    subscription_type: selectedPlan,
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
        return pricingData.find((pricing) => pricing.student_count === selectedStudents.length);
    };

    const selectedPricing = getSelectedPricing();

    const handleBackToStudents = () => {
        router.visit('/student');
    };

    const getCurrentAmount = () => {
        return selectedPlan === 'yearly' ? selectedPricing?.yearly_amount || 0 : selectedPricing?.monthly_amount || 0;
    };

    const getCurrentBasePrice = () => {
        return selectedPlan === 'yearly' ? parseFloat(yearlySubscribePrice) : parseFloat(monthlySubscribePrice);
    };

    const calculateDiscount = () => {
        if (selectedStudents.length <= 1) return 0;
        const basePrice = getCurrentBasePrice();
        const totalWithoutDiscount = basePrice * selectedStudents.length;
        const totalWithDiscount = getCurrentAmount();
        return totalWithoutDiscount - totalWithDiscount;
    };

    const calculateMonthlySavings = () => {
        if (selectedPlan === 'monthly') return 0;
        const monthlyTotal = selectedPricing?.monthly_amount || 0;
        const yearlyTotal = selectedPricing?.yearly_amount || 0;
        const monthlyEquivalent = yearlyTotal / 12;
        return monthlyTotal - monthlyEquivalent;
    };

    return (
        <ParentLayout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-piano-gradient px-6 py-8">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-playfair mb-2 text-3xl font-bold text-primary md:text-4xl">Subscription</h1>
                                <p className="text-muted-foreground">
                                    {selectedStudentSlug
                                        ? `Subscribe ${availableStudents.find((s) => s.slug === selectedStudentSlug)?.name || 'your student'} and get a `
                                        : selectedStudentSlugs
                                          ? `Subscribe ${selectedStudentSlugs.split(',').length} selected students and get a `
                                          : 'Subscribe your students and get a '}
                                    <span className="font-bold text-green-700">10% discount</span> for each additional student you add to your
                                    subscription.
                                </p>
                            </div>
                            {(selectedStudentSlug || selectedStudentSlugs) && (
                                <Button
                                    variant="outline"
                                    onClick={handleBackToStudents}
                                    className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
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
                            {/* Plan Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Choose Your Plan
                                    </CardTitle>
                                    <CardDescription>Select between monthly and yearly billing. Save more with yearly subscription!</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {/* Monthly Plan */}
                                        <div
                                            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                                selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedPlan('monthly')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">Monthly Plan</h3>
                                                    <p className="text-2xl font-bold text-primary">${monthlySubscribePrice}</p>
                                                    <p className="text-sm text-muted-foreground">per student / month</p>
                                                </div>
                                                <div
                                                    className={`h-4 w-4 rounded-full border-2 ${
                                                        selectedPlan === 'monthly' ? 'border-primary bg-primary' : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selectedPlan === 'monthly' && (
                                                        <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm text-muted-foreground">Perfect for trying out our service</div>
                                        </div>

                                        {/* Yearly Plan */}
                                        <div
                                            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                                selectedPlan === 'yearly' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedPlan('yearly')}
                                        >
                                            <div className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                                                Best Value
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">Yearly Plan</h3>
                                                    <p className="text-2xl font-bold text-primary">${yearlySubscribePrice}</p>
                                                    <p className="text-sm text-muted-foreground">per student / year</p>
                                                    <p className="text-sm font-medium text-green-600">
                                                        ${(parseFloat(yearlySubscribePrice) / 12).toFixed(2)}/month
                                                    </p>
                                                </div>
                                                <div
                                                    className={`h-4 w-4 rounded-full border-2 ${
                                                        selectedPlan === 'yearly' ? 'border-primary bg-primary' : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selectedPlan === 'yearly' && (
                                                        <div className="h-full w-full scale-50 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm font-medium text-green-600">
                                                Save ${(parseFloat(monthlySubscribePrice) * 12 - parseFloat(yearlySubscribePrice)).toFixed(2)} per
                                                year!
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing & Benefits */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Subscription Benefits
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="mb-2 block">
                                            Base price: <b>${getCurrentBasePrice()}</b> per student ({selectedPlan}). For every additional student,
                                            you get a <b>10% discount</b> off their price.
                                        </span>
                                        <span className="block">
                                            Example: 2 students = ${getCurrentBasePrice()} + ${getCurrentBasePrice()} × 0.9
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-blue-700">
                                        <div className="flex items-center space-x-2">
                                            <Check className="h-4 w-4" />
                                            <span>
                                                {selectedPlan === 'yearly' ? '48' : '4'} private piano lessons per{' '}
                                                {selectedPlan === 'yearly' ? 'year' : 'month'}
                                            </span>
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
                                        {selectedPlan === 'yearly' && (
                                            <div className="flex items-center space-x-2">
                                                <Check className="h-4 w-4" />
                                                <span className="font-medium text-green-600">Save up to 2 months of lessons with yearly plan!</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Unsubscribed Students Section */}
                            <div>
                                <h2 className="mb-2 flex items-center text-xl font-bold">
                                    <Users className="mr-2 h-5 w-5" />
                                    Select Students to Subscribe
                                </h2>
                                <p className="mb-4 text-muted-foreground">
                                    Choose which students you want to subscribe. You can select multiple students for better discounts.
                                </p>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="font-semibold">Unsubscribed Students</span>
                                            </div>
                                            {availableStudents.length > 1 && (
                                                <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-sm">
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
                                                        <label htmlFor={`student-${student.id}`} className="flex-1 cursor-pointer">
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
                                    <h2 className="mb-2 flex items-center text-xl font-bold">
                                        <Check className="mr-2 h-5 w-5 text-green-600" />
                                        Subscribed Students
                                    </h2>
                                    <p className="mb-4 text-muted-foreground">Your currently subscribed students and their subscription details.</p>
                                    <Card>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {subscribedStudents.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        className="flex items-center justify-between rounded-lg border bg-green-50 p-3"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                                <span className="font-semibold text-green-700">
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
                                                <span>1st student: Full price (${getCurrentBasePrice()})</span>
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
                                            <span>{selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Price</span>
                                            <span className="font-semibold">${getCurrentAmount()}</span>
                                        </div>
                                        {selectedPlan === 'yearly' && (
                                            <div className="flex justify-between text-blue-600">
                                                <span>Monthly Equivalent</span>
                                                <span>${(getCurrentAmount() / 12).toFixed(2)}/month</span>
                                            </div>
                                        )}
                                        {selectedPricing && selectedPricing.student_count > 1 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Multi-Student Discount</span>
                                                <span>-${calculateDiscount().toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedPlan === 'yearly' && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Yearly Savings</span>
                                                <span>Save ${calculateMonthlySavings().toFixed(2)}/month</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total</span>
                                                <span>
                                                    ${getCurrentAmount()}/{selectedPlan === 'yearly' ? 'year' : 'month'}
                                                </span>
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
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Subscribe Now
                                            </>
                                        )}
                                    </Button>
                                    <p className="mt-2 text-center text-xs text-muted-foreground">Secure payment powered by Stripe</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
};

export default Subscription;
